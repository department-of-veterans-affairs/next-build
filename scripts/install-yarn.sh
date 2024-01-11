#!/bin/sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm use 18.18.0

npm uninstall -g corepack yarn pnpm
npm install -g corepack

corepack enable
corepack install -g --cache-only .yarn/releases/corepack.tgz
