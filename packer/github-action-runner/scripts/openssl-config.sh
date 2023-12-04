#!/usr/bin/env bash

set -e
set -o pipefail

# TODO: Check for existing options and append to the [system_default_sect] section
echo "Options = UnsafeLegacyRenegotiation" >> /etc/ssl/openssl.cnf