#!/bin/sh
ls -al envs
cat envs/.env.prod
APP_ENV=$APP_ENV yarn build:preview && yarn start
