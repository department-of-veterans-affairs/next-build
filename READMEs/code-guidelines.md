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

## Typedoc

We use [Typedoc](https://typedoc.org/) to automatically generate documentation from our codebase. Typedoc is an extension of JSDoc that allows code documentation in-place through annotations.

At a minimum, if you are creating a component, type, class, etc, you should create a Typedoc annotation explaining what that structure does. Typedoc annotations are of the following formats:

```
/** This is a basic text explanation of what this component does and anything someone might need to know about it. */
/**
 * This comment structure is also respected and probably better for longer annotations.
 */
const myComponent = ({props} => {
  // the component
});
```

Ideally, if you are defining types in particular, an explanation of what each property in the type is for can be helpful. For example:

```
/**
 * An individual story published by a Facility.
 *
 * @see https://prod.cms.va.gov/admin/structure/types/manage/news_story/fields */
export interface NodeNewsStory extends DrupalNode {
  /** The credited author of the story. {@link NodePersonProfile} */
  field_author: NodePersonProfile
  /** The primary story text. */
  field_full_story: FieldFormattedText
  /** Caption for the attached image. */
  field_image_caption: string
  // snip
```

There are JSDoc and Typedoc tags that you can use to augment your annotations:

- [Typedoc tag documentation](https://typedoc.org/guides/doccomments/)
- [JSDoc documentation](https://jsdoc.app/)

Typedoc docs can be generated at any time:

```
yarn typedoc
```

This will output the docs to `typedocs/` at the root of the repository. It is also
generated automatically for every PR environment.
