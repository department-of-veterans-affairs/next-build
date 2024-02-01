#!/bin/sh

# Shell script invoked by next-build docker container (see docker/Dockerfile).
# Env vars must be present to populate cmd params.
# Secrets (remaining required params) must be present at ./envs/.env.${ENV}.

APP_ENV=${ENV} yarn dev \
    --SITE_URL ${SITE_URL} \
    --NEXT_PUBLIC_DRUPAL_BASE_URL ${NEXT_PUBLIC_DRUPAL_BASE_URL} \
    --NEXT_IMAGE_DOMAIN ${NEXT_IMAGE_DOMAIN} \
    --REDIS_URL ${REDIS_URL} \
    --NEXT_PUBLIC_ASSETS_URL=./public/generated/