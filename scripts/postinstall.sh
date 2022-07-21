#!/usr/bin/env bash

# Source nvm
export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

npx husky install
git submodule update --init --recursive
cd vets-website
nvm use 14.15.0
yarn install
nvm use 16.13.0