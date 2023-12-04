#!/usr/bin/env bash

set -e
set -o pipefail

# Unregisters all github runner processes on the machine. Intended to be executed just before
# shutting down the EC2 instance. W/o this script, github loses contact w/ the runner and lists
# it as "Offline" on https://github.com/<ORG>/<REPO>/settings/actions/runners

# Script assumes each runner is contained within it's own folder named /home/runner/runnerX
# where "X" is a number from 1 to number of runners.

RUNNER_HOME=/home/runner
GITHUB_TOKEN=$(aws ssm get-parameter --name /devops/VA_VSP_BOT_GITHUB_TOKEN --with-decryption | jq -r .Parameter.Value)
GITHUB_URL=$(cat $RUNNER_HOME/runner1/.runner | jq -r .gitHubUrl)
GITHUB_REPO=${GITHUB_URL##*/}
REMOVE_TOKEN=$(curl \
  -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/department-of-veterans-affairs/$GITHUB_REPO/actions/runners/remove-token | jq -r .token)

i=1
while [ -d "$RUNNER_HOME/runner$i" ]
do
  cd $RUNNER_HOME/runner$i

  RUNNER_NAME=$(cat .runner | jq -r .agentName)
  echo "$(pwd): Removing runner...[$RUNNER_NAME]"

  sudo ./svc.sh stop
  sudo ./svc.sh uninstall
  sudo su -c "./config.sh remove --unattended --name $RUNNER_NAME --url $GITHUB_URL --token $REMOVE_TOKEN" runner

  (( i++ ))
done

echo "Script complete on all $i folders."