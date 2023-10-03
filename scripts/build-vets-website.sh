export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd ../vets-website

echo "Node $(node -v)"
echo "NPM $(npm -v)"
echo "Yarn $(yarn -v)"

yarn install
export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=TRUE
yarn build
