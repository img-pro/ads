// Cloudflare Pages Function: /api/generate
// Proxies requests to Anthropic API with global + per-user hourly rate limiting

// Get current hour key (UTC) for rate limiting
function getHourKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}-${String(now.getUTCHours()).padStart(2, '0')}`;
}

// Get milliseconds until next hour UTC
function getMsUntilNextHour() {
  const now = new Date();
  const nextHour = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 1));
  return nextHour.getTime() - now.getTime();
}

// Hash IP for privacy (simple hash, not cryptographic)
function hashIP(ip) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = ((hash << 5) - hash) + ip.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') ||
         request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
         'unknown';
}

// Check both global and per-user hourly limits
async function getRateLimitInfo(env, clientIP) {
  const globalLimit = parseInt(env.RATE_LIMIT_HOURLY || '25');
  const userLimit = parseInt(env.RATE_LIMIT_USER_HOURLY || '5');
  const hourKey = getHourKey();
  const globalKey = `global:${hourKey}`;
  const userKey = `user:${hashIP(clientIP)}:${hourKey}`;
  const resetAt = Date.now() + getMsUntilNextHour();

  if (!env.RATE_LIMIT) {
    console.warn('RATE_LIMIT KV not configured, rate limiting disabled');
    return { allowed: true, remaining: userLimit, resetAt: null };
  }

  try {
    const [globalCount, userCount] = await Promise.all([
      env.RATE_LIMIT.get(globalKey).then(v => parseInt(v) || 0),
      env.RATE_LIMIT.get(userKey).then(v => parseInt(v) || 0)
    ]);

    // Check global limit first
    if (globalCount >= globalLimit) {
      return { allowed: false, remaining: 0, resetAt, reason: 'global' };
    }

    // Check per-user limit
    if (userCount >= userLimit) {
      return { allowed: false, remaining: 0, resetAt, reason: 'user' };
    }

    const userRemaining = userLimit - userCount - 1;
    return { allowed: true, remaining: userRemaining, resetAt, globalKey, userKey };
  } catch (e) {
    console.error('Rate limit check failed:', e);
    return { allowed: true, remaining: userLimit, resetAt: null };
  }
}

async function incrementRateLimit(env, rateInfo) {
  if (!env.RATE_LIMIT || !rateInfo.globalKey) return;

  const ttl = Math.ceil(getMsUntilNextHour() / 1000) + 60;

  try {
    const [globalCount, userCount] = await Promise.all([
      env.RATE_LIMIT.get(rateInfo.globalKey).then(v => parseInt(v) || 0),
      env.RATE_LIMIT.get(rateInfo.userKey).then(v => parseInt(v) || 0)
    ]);

    await Promise.all([
      env.RATE_LIMIT.put(rateInfo.globalKey, String(globalCount + 1), { expirationTtl: ttl }),
      env.RATE_LIMIT.put(rateInfo.userKey, String(userCount + 1), { expirationTtl: ttl })
    ]);
  } catch (e) {
    console.error('Rate limit increment failed:', e);
  }
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestOptions(context) {
  // Handle CORS preflight
  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request.headers.get('Origin'))
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin');

  // Validate API key is configured
  if (!env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({
      error: 'API not configured',
      message: 'Server API key not set. Please use your own API key.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });
  }

  // Check global + per-user hourly rate limits
  const clientIP = getClientIP(request);
  const rateInfo = await getRateLimitInfo(env, clientIP);

  if (!rateInfo.allowed) {
    const resetDate = new Date(rateInfo.resetAt);
    const message = rateInfo.reason === 'user'
      ? 'You\'ve reached your hourly demo limit. Add your API key for unlimited access.'
      : 'Demo limit reached for this hour. Try again soon or add your API key.';
    return new Response(JSON.stringify({
      error: 'rate_limit_exceeded',
      message,
      resetAt: rateInfo.resetAt,
      resetAtFormatted: resetDate.toISOString()
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.floor(rateInfo.resetAt / 1000)),
        'Retry-After': String(Math.ceil((rateInfo.resetAt - Date.now()) / 1000)),
        ...corsHeaders(origin)
      }
    });
  }

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });
  }

  // Validate request structure
  const { type, model, messages, max_tokens } = body;

  if (!type || !['style', 'copy'].includes(type)) {
    return new Response(JSON.stringify({ error: 'Invalid request type. Must be "style" or "copy".' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });
  }

  // Enforce model constraints (prevent abuse)
  const allowedModels = {
    style: 'claude-opus-4-5-20251101',
    copy: 'claude-opus-4-5-20251101'
  };
  const safeModel = allowedModels[type];

  // Enforce token limits
  const maxTokenLimits = { style: 1024, copy: 2048 };
  const safeMaxTokens = Math.min(max_tokens || maxTokenLimits[type], maxTokenLimits[type]);

  // Forward to Anthropic API
  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: safeModel,
        max_tokens: safeMaxTokens,
        messages: messages
      })
    });

    // Update rate limit after successful API call
    await incrementRateLimit(env, rateInfo);

    const responseData = await anthropicResponse.json();

    // Forward the response with rate limit headers
    return new Response(JSON.stringify(responseData), {
      status: anthropicResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': String(rateInfo.remaining),
        'X-RateLimit-Reset': rateInfo.resetAt ? String(Math.floor(rateInfo.resetAt / 1000)) : '',
        'X-Demo-Mode': 'true',
        ...corsHeaders(origin)
      }
    });

  } catch (e) {
    console.error('Anthropic API error:', e);
    return new Response(JSON.stringify({
      error: 'API request failed',
      message: e.message
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });
  }
}
