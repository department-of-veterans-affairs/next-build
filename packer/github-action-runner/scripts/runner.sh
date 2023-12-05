#!/usr/bin/env bash

set -e
set -o pipefail

useradd -d /home/runner -m -G docker runner
mkdir -p /opt/hostedtoolcache
chown -R runner: /opt/hostedtoolcache
