#!/usr/bin/env bash

# Source nvm
export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

npx husky install
git submodule update --init --recursive
cd vets-website
nvm use
yarn install
