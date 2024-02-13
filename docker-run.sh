#!/bin/sh

APP_ENV=$APP_ENV yarn build:preview && yarn start \
    --SITE_URL $SITE_URL \
    --NEXT_PUBLIC_DRUPAL_BASE_URL $NEXT_PUBLIC_DRUPAL_BASE_URL \
    --NEXT_IMAGE_DOMAIN $NEXT_IMAGE_DOMAIN \
    --USE_REDIS=false \
    --NEXT_PUBLIC_ASSETS_URL=/generated/
