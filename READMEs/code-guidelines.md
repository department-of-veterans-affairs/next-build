# Code guidelines

Next-build is primarily a TypeScript project. ES6+ syntax is preferred, and code style is enforced using ESLint and Prettier.
We are using the [ESLint settings from Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/eslint) with some extra plugins to ease friction with other tooling (jest, storybook, etc).

ESLint handles Javascript syntax rules and [Prettier](https://prettier.io/) ensures consistent code formatting of things like indentations, quote styles, etc.

## Code style

You can check code style at any time by using:

- `yarn lint` to lint all files
- `yarn format` to format all files

Lint and format run automatically on all git staged files as part of our pre-commit hooks using [lint-staged](https://github.com/lint-staged/lint-staged).

Additionally, we use an [`.editorconfig` file](https://editorconfig.org/) to ensure consistency across developers' IDEs.

### Configuration

ESLint configuration is found in `.eslintrc.json` and `.eslintignore`. As stated, these are mostly OOTB settings from next.js' eslint settings, with some additional settings to ease friction with other tools that we use. Additional rules can be configured as needed inside of the `"rules":` object.

Settings for Prettier are found in `.prettierrc.json` and `.prettierignore`.

Lint-staged settings are found in `lint-staged.config.js`. This file essentially takes a glob of file formats and the command to run for those file types.

EditorConfig settings can be found in `.editorconfig`

### Editor Integration

We recommend integrating Prettier and ESLint with your IDE of choice. Most editors (VSCode / Jetbrains / others)
will automatically pick up ESLint settings from the project and provide context for errors in-line. Prettier can be
configured to run on each file save, keeping things formatted as you work. You may need to run `yarn install` first.

You may also need to install an EditorConfig plugin to ensure that the settings in `.editorconfig` are picked up by your IDE.

#### VSCode:

- https://github.com/prettier/prettier-vscode
- https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig

#### PHPStorm:

- https://www.jetbrains.com/help/phpstorm/prettier.html
- https://www.jetbrains.com/help/phpstorm/eslint.html
- https://www.jetbrains.com/help/phpstorm/editorconfig.html

#### Additional Resources:

- https://eslint.org/docs/latest/use/integrations#editors
- https://prettier.io/docs/en/editors
- https://editorconfig.org/
