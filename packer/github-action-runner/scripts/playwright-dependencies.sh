#!/usr/bin/env bash

set -e
set -o pipefail

apt update
apt install -y \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2
