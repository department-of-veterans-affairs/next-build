// Run `yarn plop` to use the generators defined in this file.
// see READMEs/generators.md for more information.
module.exports = function (plop) {
  // Create a new component with a test stub and Storybook entry.
  plop.setGenerator('Component', {
    description: 'New React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component Name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/templates/components/{{camelCase name}}/index.tsx',
        templateFile: 'generator-templates/component/index.hbs',
      },
      {
        type: 'add',
        path: 'src/templates/components/{{camelCase name}}/index.test.tsx',
        templateFile: 'generator-templates/component/test.hbs',
      },
      {
        type: 'add',
        path: 'src/templates/components/{{camelCase name}}/{{camelCase name}}.stories.ts',
        templateFile: 'generator-templates/component/story.hbs',
      },
    ],
  })

  // Create a new data query. This defaults to Drupal boilerplate.
  // TODO: option for non-drupal data sources.
  plop.setGenerator('Query', {
    description: 'New Data query',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Query name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/data/queries/{{camelCase name}}.ts',
        templateFile: 'generator-templates/query/query.hbs',
      },
      {
        type: 'add',
        path: 'src/data/queries/tests/{{camelCase name}}.test.tsx',
        templateFile: 'generator-templates/query/test.hbs',
      },
      {
        type: 'add',
        path: 'src/mocks/{{camelCase name}}.mock.json',
        templateFile: 'generator-templates/query/mock.hbs',
      },
      {
        type: 'add',
        path: 'src/types/formatted/{{camelCase name}}.ts',
        templateFile: 'generator-templates/type/formatted.hbs',
      },
      // Strings can be added to print a comment in the terminal.
      'You will need to do a few steps manually:',
      '- Import & add your query to src/data/queries/index.ts',
      '- Add your resource type to src/lib/constants/resourceTypes.ts',
      '- Update the mock.json with correct data',
      '- Run `yarn test:u` to update test snapshots for your new query!',
    ],
  })

  // Generate all files needed to render a new content type from Drupal.
  // It also generates an additional test file for E2E testing the page via Playwright.
  plop.setGenerator('Content Type', {
    description: 'Generate boilerplate for new FE Page based on Content Type',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Page name please',
      },
    ],
    actions: [
      // Create query files for new Page type.
      {
        type: 'add',
        path: 'src/data/queries/{{camelCase name}}.ts',
        templateFile: 'generator-templates/query/query.hbs',
      },
      {
        type: 'add',
        path: 'src/data/queries/tests/{{camelCase name}}.test.tsx',
        templateFile: 'generator-templates/query/test.hbs',
      },
      {
        type: 'add',
        path: 'src/mocks/{{camelCase name}}.mock.json',
        templateFile: 'generator-templates/query/mock.hbs',
      },
      {
        type: 'add',
        path: 'src/types/formatted/{{camelCase name}}.ts',
        templateFile: 'generator-templates/type/formatted.hbs',
      },
      'You will need to do a few steps manually:',
      '- Import & add your query to src/data/queries/index.ts',
      '- Add your resource type to src/lib/constants/resourceTypes.ts',
      '- Update the mock.json with correct data',
      '- Run `yarn test:u` to update test snapshots for your new query!',
      // Create react component + test files for new Page type.
      {
        type: 'add',
        path: 'src/templates/layouts/{{camelCase name}}/index.tsx',
        templateFile: 'generator-templates/component/index.hbs',
      },
      {
        type: 'add',
        path: 'src/templates/layouts/{{camelCase name}}/index.test.tsx',
        templateFile: 'generator-templates/component/test.hbs',
      },
      {
        type: 'add',
        path: 'src/templates/layouts/{{camelCase name}}/{{camelCase name}}.stories.ts',
        templateFile: 'generator-templates/component/story.hbs',
      },
      {
        type: 'add',
        path: 'playwright/tests/{{camelCase name}}.spec.js',
        templateFile: 'generator-templates/component/playwright.hbs',
      },
      'To render your new page type, update [[...slug]].tsx',
    ],
  })

  // Add additional generators here
}
