# next-build

Front-end templating, build, and deploy for VA.gov CMS content.

## Local setup

Prerequisites

- [VA SOCKS access](https://depo-platform-documentation.scrollhelp.site/getting-started/Internal-tools-access-via-SOCKS-proxy.1821081710.html)
- [NVM](https://github.com/nvm-sh/nvm) for node version management
- [Yarn](https://yarnpkg.com/getting-started/install) for package management

You should set these up before attempting to install the repo.

## Basic local installation

1. Clone the repo if you haven't.
   `git@github.com:department-of-veterans-affairs/next-build.git`

1. Clone the vets-website repo adjacent to next-build in the same parent directory.
   `git@github.com:department-of-veterans-affairs/vets-website.git`

1. In vets-website, set node and yarn to the required versions: `nvm use 14.15.0` && `yarn set version 1.19.1`

1. `yarn install` and `yarn build`. You are now done in vets-website.

1. In the next-build directory, `nvm use 18` && `yarn set version stable`

1. Run `yarn install`.

1. Copy `envs/.env.example` to `envs/.env.local`. This is a reasonable set of environment defaults for local development.

1. Make sure your SOCKS access is running. (e.g. `vtk socks on`)

1. Run `yarn dev`.

You will now have a Next.js development server running at http://localhost:3000, which will refresh with changes to your local environment.

## Environment Flags

The APP_ENV flag can be used to designate which .env file you want to use. Ensure your env files are in `./envs`, and then run your build or dev command with a leading `APP_ENV=local`.

ie `APP_ENV=local yarn dev`

Ensure the value passed into APP_ENV matches the file name of the .env file you wish to use.

If no value is passed `.env.local` will be used as the default

## Local CMS endpoint

To use the local CMS as an endpoint, follow the install directions for [the CMS repo here](https://github.com/department-of-veterans-affairs/va.gov-cms/blob/main/READMES/getting-started.md).

While installing those dependencies, you will run `mkcert -install`. This certificate is used by ddev, and also
needs to be used by next-build to enable connections over `https://` locally.

Steps to do so:
`mkcert -CAROOT` to find where the rootCA.pem was installed
`cp the/above/directory/rootCA.pem path/to/next-build/certs/rootCA.pem`

This certificate should be git ignored by default. In your `.env.local` file, update the endpoints to:

```
# This is the standard lower environment for Content API.
#NEXT_PUBLIC_DRUPAL_BASE_URL=https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov
#NEXT_IMAGE_DOMAIN=https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov

# If running va.gov-cms locally
NEXT_PUBLIC_DRUPAL_BASE_URL=https://va-gov-cms.ddev.site
NEXT_IMAGE_DOMAIN=https://va-gov-cms.ddev.site
```

Now you can run `yarn dev` and data will be coming from your local CMS environment instead.

## Generating the static site

To generate the static pages for https://va.gov, run `yarn export`. This command will generate static pages for all paths that next-build is aware of.

To use the redis cache during your static build, run the following command before running `yarn export`:

```sh
docker run --name next-redis -p 6379:6379 -d redis
```

This will start [redis](https://redis.io/) in a docker container that can be reached from your localhost.`localhost:6379`. For more on how this project uses redis, check the [caching readme](READMEs/caching.md).

## Documentation (WIP)

- [Code Guidelines](READMEs/code-guidelines.md)
- [Testing](READMEs/testing.md)
- [TypeScript](READMEs/typescript.md)
- [Example Tests](example_tests/README.md)
