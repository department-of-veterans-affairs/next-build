# env-loader

The env-loader package is our custom solution for ingesting environment variables from multiple sources using the [`commander` package](https://www.npmjs.com/package/commander).

It collects variables from:

1. the CMS environment's defined feature flags

- which CMS enviroment determined via `NEXT_PUBLIC_BASE_DRUPAL_URL` env var

2. appropriate `.env` file in `envs/` based on the `APP_ENV` env var

- (defaults to `.env.local`)

3. CLI options included with the command

After collecting (and overwriting values as needed based on the order above), all env vars are set and the command runs. Keep in mind the ordering. If the same environment variable is set in both the CMS feature flags and in the .env file, the value in the .env file will be chosen.

For a full list of CLI options available, see [cli-options.tsx](packages/env-loader/src/cli-options.ts)

If you need to pass a CLI flag to an underlying command, you can use `--` to separate options. Any flags after the `--` will be directed to the underlying process instead of our env-loader logic.

For example, `yarn test` runs the Jest tests. Running `yarn test -- -u` will pass the `-u` flag to the underlying jest command being run with `yarn test` (equivalent to running `jest -u`).

Running `yarn test -u` will not pass to the underlying jest command and will have no effect, as `-u` is not a defined CLI option for `env-loader`.
