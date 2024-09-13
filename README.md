# next-build

Front-end templating, build, and deploy for VA.gov CMS content. Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.

Under the hood, Next.js also abstracts and automatically configures tooling needed for React, like bundling, compiling, and more. This allows you to focus on building your application instead of spending time with configuration.

![CI](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/codeql-analysis.yml/badge.svg)
![Playwright Tests](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/playwright.yml/badge.svg)

## Table of contents

- [Quickstart](#quickstart)
- [Guide to other readmes](#guide-to-other-readmes)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Quickstart

### Local setup

Prerequisites

- [VA SOCKS access](https://depo-platform-documentation.scrollhelp.site/getting-started/Internal-tools-access-via-SOCKS-proxy.1821081710.html)
- [NVM](https://github.com/nvm-sh/nvm) for node version management
- [Yarn](https://yarnpkg.com/getting-started/install) for package management
- [Docker](https://www.docker.com/products/docker-desktop/) for the redis container

You should set these up before attempting to install the repo.

### Basic local installation

1. Clone the repo if you haven't.
   `git clone git@github.com:department-of-veterans-affairs/next-build.git`

2. Clone the vets-website repo adjacent to next-build in the same parent directory. `git clone git@github.com:department-of-veterans-affairs/vets-website.git`. This is necessary to source some assets used by various FE widgets, like fonts and images.

3. In the `next-build/` directory, `nvm use 18` && `yarn set version stable`

4. Run `yarn install`.

5. Copy `envs/.env.example` to `envs/.env.local`. This is a reasonable set of environment defaults for local development.

6. Make sure your SOCKS access is running. (e.g. `vtk socks on`)

7. In the `next-build` directory, run `yarn setup` to pull initial built assets from the `vets-website` repo. This will grab a bunch of files from a vets-website S3 bucket and place them into the appropriate `public/` folders.

8. Run `yarn dev`.

You will now have a Next.js development server running at http://localhost:3999, which will refresh with changes to your local environment. (Note: your local port may differ if you changed the value for `PORT` in .env.local).

### Environment Flags

The APP_ENV flag can be used to designate which .env file you want to use. Ensure your env files are in `./envs`, and then run your build or dev command with a leading `APP_ENV=local`.

ie `APP_ENV=local yarn dev`

Ensure the value passed into APP_ENV matches the file name of the .env file you wish to use.

If no value is passed `.env.local` will be used as the default

#### Additional flags

Additional env flags can be set by prepending them with "--". To pass arguments through to the underlying utility (e.g. jest) use "--" as a separator.

Examples:

```
yarn dev --NEXT_PUBLIC_DRUPAL_BASE_URL https://staging.cms.va.gov -- --port 3003
```

```
yarn test -- path/to/file
```

Available env variables and underlying utility help can be viewed by appending `-h` to the yarn script:
Examples:

```
yarn test -h
```

```
yarn build -h
```

### Local CMS endpoint

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

#### Local CMS Preview

To test the preview API route locally, you will also need to add public and private OAuth keys to your local clone of the va.gov-cms root directory at `public.key` and `private.key` respectively. These files are gitignored in the va.gov-cms repo.

```
-----BEGIN PUBLIC KEY-----
Retrieve this value from AWS SSM @ /cms/staging/drupal_api_users/next_build_api/public.key
-----END PUBLIC KEY-----
```

```
-----BEGIN RSA PRIVATE KEY-----
Retrieve this value from AWS SSM @ /cms/staging/drupal_api_users/next_build_api/private.key
-----END RSA PRIVATE KEY-----
```

See the [Preview README](/READMEs/preview.md) for more information.

### Local vets-website assets

By default, the `yarn setup` command pulls assets from the prod S3 bucket. This can be changed base on the `BUILD_TYPE` env var.

To use assets from your local vets-website branch, first run a local build in that repo to compile your desired changes. **Be sure to check your node versions when switching between these repos!** `vets-website` uses node 14, `next-build` uses node 18. Using the wrong version when building will cause errors in both repos!

Then running `BUILD_TYPE=localhost yarn setup` will create a symlink to the local compiled output instead of downloading assets from a S3 bucket.

See `./scripts/yarn/vets-website-assets.js` for more information.

### Generating the static site

To generate the static pages for https://va.gov, run `yarn export`. This command will generate static pages for all paths that next-build is aware of.

To use the redis cache during your static build, run `yarn redis` before running `yarn export`.

This will start [redis](https://redis.io/) in a docker container via

```sh
docker run --name next-redis -p 6379:6379 -d redis
```

This container can be reached from your localhost (e.g. `redis://localhost:6379`). You can interact directly with the redis container by running `yarn redis:cli`. For more on how this project uses redis, check the [caching readme](READMEs/caching.md).

<a name="others"></a>

## Guide to other READMES

| README                                               | Purpose                                                                                                                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Slug](READMEs/[[...slug]].md)                       |                                                                                                                                                           |
| [Analytics](READMEs/analytics.md)                    |                                                                                                                                                           |
| [Broken links](READMEs/broken-links.md)              |                                                                                                                                                           |
| [Caching](READMEs/caching.md)                        |                                                                                                                                                           |
| [Code guidelines](READMEs/code-guidelines.md)        |                                                                                                                                                           |
| [Environment loader](READMEs/env-loader.md)          |                                                                                                                                                           |
| [Generators](READMEs/generators.md)                  |                                                                                                                                                           |
| [Lovell](READMEs/lovell.md)                          | Information about how nextbuild handles the custom code needed for the James A Lovell health care center. It is both an army hospital and a VA hospital   |
| [Status](READMEs/next-build-status.md)               |                                                                                                                                                           |
| [Pagination](READMEs/pagination.md)                  |                                                                                                                                                           |
| [Paragraph](READMEs/paragraph.md)                    |                                                                                                                                                           |
| [Preview](READMEs/preview.md)                        |                                                                                                                                                           |
| [Queries](READMEs/queries.md)                        |                                                                                                                                                           |
| [Storybook](READMEs/storybook.md)                    |                                                                                                                                                           |
| [Templates](READMEs/templates.md)                    |                                                                                                                                                           |
| [Testing](READMEs/testing.md)                        | Information about our various testing procedures such as: Jest, playwright, a11y, load testing, and lighthouse testing                                    |
| [Example Testing](example_tests/README.md)           | Information about our various testing procedures such as: Jest, playwright, a11y, load testing, and lighthouse testing                                    |
| [Tugboat](READMEs/tugboat.md)                        |                                                                                                                                                           |
| [Content Release](READMEs/devops/content-release.md) | Information about our github action "content-release" which is largely responsible for producing consumable content                                       |
| [Datadog](READMEs/devops/datadog.md)                 | Application Performance Monitoring and alerting                                                                                                                                                          |
| [Datasync](READMEs/devops/datasync.md)               |                                                                                                                                                           |
| [EKS](READMEs/devops/eks.md)                         | Information about how we leverage the persistent server and how we leverage EKS to host it                                                                |
| [Infrastructure](READMEs/devops/infrastructure.md)   | Informational catch all for how our infrastructure works. If you are looking for an understanding of our system architecture, this is the file to look at |

## Troubleshooting

## Common Problems

## FAQ
