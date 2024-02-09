# TODO: this has dev dependencies in order to get it working, not a final product.
# Remove dev dependences to shrink image size too.
# Note that this must be build from the 

FROM node:18-alpine as build

RUN mkdir -p /app/content-build
RUN mkdir -p /app/vets-website

COPY ./next-build /app/next-build
COPY ./vets-website /app/vets-website

WORKDIR /app/next-build
RUN yarn install --frozen-lockfile
RUN BUILD_TYPE=vagovprod node ./scripts/yarn/vets-website-assets.mjs



FROM node:18-alpine as application

ENV NODE_ENV production
ENV HOME /app
WORKDIR $HOME

RUN addgroup --gid 1001 nextjs \
  && adduser --uid 1001 --system --home $HOME --ingroup nextjs nextjs

# TODO: refine copy to only necessary app components
COPY --chown=nextjs:nextjs --from=build /app/next-build $HOME
RUN chmod +x docker-run.sh

USER nextjs
ENV HOSTNAME 0.0.0.0
EXPOSE 3999

CMD "./docker-run.sh"
