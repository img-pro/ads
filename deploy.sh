#!/bin/bash
# Cache-busting build script for Cloudflare Pages
# Appends git commit hash to CSS/JS references in index.html

HASH=${CF_PAGES_COMMIT_SHA:-$(git rev-parse --short HEAD)}
HASH=${HASH:0:7}

# Update asset references with version hash
sed -i "s/styles\.css[^\"']*/styles.css?v=$HASH/g" src/index.html
sed -i "s/config\.js[^\"']*/config.js?v=$HASH/g" src/index.html
sed -i "s/app\.js[^\"']*/app.js?v=$HASH/g" src/index.html

echo "Cache-busted assets with version: $HASH"
