#!/bin/bash

###
# Run the fetch-entity script using a version of Node that can strip the
# TypeScript anotations. The current version in the .nvmrc file can't do that,
# so we're leveraging `nvm` to make sure a version of Node that will run this
# script is installed, then specifically using that version to run it.
###

# The version of Node.js to use for this script
NODE_VERSION="24"

# Get the directory of the current shell script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Construct the relative path to the TypeScript module
SCRIPT_PATH="$DIR/src/index.ts"

# Load NVM manually
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if the version is installed
if ! nvm version "$NODE_VERSION" >/dev/null 2>&1; then
  echo "⬇️ Node.js $NODE_VERSION is not installed. Installing..."
  nvm install "$NODE_VERSION"
  echo "✅ Done installing Node.js $NODE_VERSION."
fi

# Without this, yarn would continue to use the incorrect version. So we're not
# relying on _any_ $PATH resolution to determine which `node` executable to run.
# Just use this one.
NODE="$NVM_DIR/versions/node/$(nvm version "$NODE_VERSION")/bin/node"

# Run the command using the latest stable version of Node.js so we can strip the
# TS annotations.
NODE_OPTIONS='--disable-warning=ExperimentalWarning' $NODE "$SCRIPT_PATH" "$@"
