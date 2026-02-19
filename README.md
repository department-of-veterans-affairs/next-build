# next-build

Front-end templating, build, and deploy for VA.gov CMS content.

![CI](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/codeql-analysis.yml/badge.svg)
![Playwright Tests](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/playwright.yml/badge.svg)

## Local setup

Prerequisites

- [a local VA CMS instance](https://github.com/department-of-veterans-affairs/va.gov-cms/blob/main/READMES/getting-started.md)
- [NVM](https://github.com/nvm-sh/nvm) for node version management
- [Yarn](https://yarnpkg.com/getting-started/install) for package management
- [Docker](https://www.docker.com/products/docker-desktop/) for the redis container

You should set these up before attempting to install the repo.

## Basic local installation

1. Clone the repo if you haven't.
   `git clone git@github.com:department-of-veterans-affairs/next-build.git`

2. Clone the vets-website repo adjacent to next-build in the same parent directory. `git clone git@github.com:department-of-veterans-affairs/vets-website.git`. This is necessary to source some assets used by various FE widgets, like fonts and images.

3. In the `next-build/` directory, `nvm use`

4. Run `yarn install`.

5. Copy `envs/.env.example` to `envs/.env.local`. This is a reasonable set of environment defaults for local development.

6. Make sure you have a local VA CMS instance running. Follow [the CMS repo setup instructions](https://github.com/department-of-veterans-affairs/va.gov-cms/blob/main/READMES/getting-started.md) if needed.

7. In the `next-build` directory, run `yarn setup` to pull initial built assets from the `vets-website` repo. This will grab a bunch of files from a vets-website S3 bucket and place them into the appropriate `public/` folders.

8. Run `yarn dev`.

You will now have a Next.js development server running at http://localhost:3999, which will refresh with changes to your local environment. (Note: your local port may differ if you changed the value for `PORT` in .env.local).

## Environment Flags

The APP_ENV flag can be used to designate which .env file you want to use. Ensure your env files are in `./envs`, and then run your build or dev command with a leading `APP_ENV=local`.

ie `APP_ENV=local yarn dev`

Ensure the value passed into APP_ENV matches the file name of the .env file you wish to use.

If no value is passed `.env.local` will be used as the default

### Additional flags

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
#NEXT_PUBLIC_DRUPAL_BASE_URL=https://mirror.cms.va.gov
#NEXT_IMAGE_DOMAIN=https://mirror.cms.va.gov

# If running va.gov-cms locally
NEXT_PUBLIC_DRUPAL_BASE_URL=https://va-gov-cms.ddev.site
NEXT_IMAGE_DOMAIN=https://va-gov-cms.ddev.site
```

Now you can run `yarn dev` and data will be coming from your local CMS environment instead.

### Local CMS Preview

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

## Local vets-website assets

By default, the `yarn setup` command pulls assets from the prod S3 bucket. This can be changed base on the `BUILD_TYPE` env var.

To use assets from your local vets-website branch, first run a local build in that repo to compile your desired changes. **Be sure to check your node versions when switching between these repos!** `vets-website` uses node 14, `next-build` uses node 22. Using the wrong version when building will cause errors in both repos!

Then running `BUILD_TYPE=localhost yarn setup` will create a symlink to the local compiled output instead of downloading assets from a S3 bucket.

See `./scripts/yarn/vets-website-assets.js` for more information.

## Generating the static site

To generate the static pages for https://va.gov, run `yarn export`. This command will generate static pages for all paths that next-build is aware of.

To use the redis cache during your static build, run `yarn redis` before running `yarn export`.

This will start [redis](https://redis.io/) in a docker container via

```sh
docker run --name next-redis -p 6379:6379 -d redis
```

This container can be reached from your localhost (e.g. `redis://localhost:6379`). You can interact directly with the redis container by running `yarn redis:cli`. For more on how this project uses redis, check the [caching readme](READMEs/caching.md).

## Documentation (WIP)

- [Template Migration](docs/template-migration/README.md)
- [Code Guidelines](READMEs/code-guidelines.md)
- [Testing](READMEs/testing.md)
- [TypeScript](READMEs/typescript.md)
- [Working with other repos](READMEs/next-build-and-other-repos.md)

## Broken link scanner (lychee wrapper)

We include a convenience script to run Lychee per-site-page and produce per-page JSON + a combined CSV/JSON report.

Location: `scripts/lychee-per-page-scan-and-merge.js`

Basic usage examples (run from the repo root):

- Scan the first 100 URLs from the default `urls.txt`:

```bash
node scripts/lychee-per-page-scan-and-merge.js --sample-size 100
```

- Scan a single page using a temporary URL list:

```bash
printf '%s\n' 'https://www.va.gov/corpus-christi-vet-center/' > tmp-urls.txt
node scripts/lychee-per-page-scan-and-merge.js --urls-file ./tmp-urls.txt --sample-size 1
rm tmp-urls.txt
```

- Pass extra Lychee args (for example to set a custom User-Agent or Accept header):

```bash
node scripts/lychee-per-page-scan-and-merge.js \
   --sample-size 1 \
   --extra-lychee-args --user-agent 'lychee-bot/1.0' --accept 'text/html'
```

Available flags (with env-var fallbacks):

- `--sample-size` / `-n` (env: SAMPLE_SIZE)
- `--urls-file` (env: URLS_FILE) — defaults to `./urls.txt`
- `--lychee-chunk-size` (env: LYCHEE_CHUNK_SIZE)
- `--batch-concurrency` (env: BATCH_CONCURRENCY)
- `--lychee-max-concurrency` (env: LYCHEE_MAX_CONCURRENCY)
- `--lychee-timeout` (env: LYCHEE_TIMEOUT)
- `--lychee-retries` (env: LYCHEE_RETRIES)
- `--exclude` (env: LYCHEE_EXCLUDE) — comma-separated list
- `--fail-on-lychee-error` (env: FAIL_ON_LYCHEE_ERROR)
- `--fail-on-missing-tools` (env: FAIL_ON_MISSING_TOOLS) — also enabled automatically on CI
- `--parent-fetch-retries` (env: PARENT_FETCH_RETRIES)
- `--parent-fetch-retry-delay-ms` (env: PARENT_FETCH_RETRY_DELAY_MS)
- `--extra-lychee-args` (env: EXTRA_LYCHEE_ARGS) — pass any additional lychee CLI options (must appear last on the command line)

Outputs:

- Per-page JSON files: `./lychee-pages/lychee-<safe-url>.json`
- Combined JSON: `./lychee-pages-combined.json`
- Combined CSV: `./lychee-pages-combined.csv`

Notes:

- Flags override env vars; env vars remain supported for CI convenience.
- The script will fail early in strict mode if Lychee or Cheerio are missing (`--fail-on-missing-tools` or CI).
- Use `--extra-lychee-args` to pass any valid Lychee option; the script adds `--` so options are parsed by Lychee correctly.
