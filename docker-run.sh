#!/bin/sh
ls -al envs
APP_ENV=$APP_ENV yarn build:preview && yarn start
