#!/usr/bin/env bash

set -e
set -o pipefail

# Set up a daily Docker prune
cat <<EOF >> /etc/cron.daily/docker-prune.sh
#!/bin/sh
docker system prune -af --volumes
EOF
chmod a+x /etc/cron.daily/docker-prune.sh