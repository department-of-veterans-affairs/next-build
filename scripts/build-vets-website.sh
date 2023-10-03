#!/bin/sh
cd ../vets-website

echo "Node $(node -v)"
echo "NPM $(npm -v)"
echo "Yarn $(yarn -v)"

export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=TRUE
yarn install
yarn build
