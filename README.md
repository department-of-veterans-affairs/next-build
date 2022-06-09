# next-build

Front-end templating, build, and deploy for VA.gov CMS content. General documentation will be here: https://vfs.atlassian.net/wiki/spaces/PCMS/pages/2166063172/next-build

## Local setup

Prerequisites

- [VA SOCKS access](https://depo-platform-documentation.scrollhelp.site/getting-started/Internal-tools-access-via-SOCKS-proxy.1821081710.html)
- [NVM](https://github.com/nvm-sh/nvm) for node version management
- [Yarn](https://yarnpkg.com/getting-started/install) for package management

You should set these up before attempting to install the repo.

### Basic local installation

1. Clone the repo if you haven't.
   `git@github.com:department-of-veterans-affairs/next-build.git`

1. Run `yarn install`.

1. Copy `.env.example` to `.env.local`. This is a reasonable set of environment defaults for local development.

1. Make sure your SOCKS access is running.

1. Run `yarn dev`.

You will now have a Next.js development server running at http://localhost:3000, which will refresh with changes to your local environment.

### Documentation

- [Code Guidelines](READMEs/code-guidelines.md)
- [Testing](READMEs/testing.md)
- [TypeScript](READMEs/typescript.md)
- [Example Tests](example_tests/README.md)
