#!/bin/sh
cd ../vets-website

nvm use 14.15.1

echo "Node $(node -v)"
echo "NPM $(npm -v)"
echo "Yarn $(yarn -v)"

export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=TRUE
yarn install
yarn build

nvm use 18.18.0