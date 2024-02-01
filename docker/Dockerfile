# TODO: this has dev dependencies in order to get it working, not a final product.
# Remove dev dependences to shrink image size too.
# Note that vets-website assets must be present in public/generated.

FROM node:18-alpine

ENV HOME /app
WORKDIR $HOME

COPY . $HOME
RUN yarn install --frozen-lockfile

CMD ["sh", "-c", "docker-run.sh"]