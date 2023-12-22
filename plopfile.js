// run `yarn plop` to use generators defined in this file
// see READMEs/plop.md for more information
module.exports = function (plop) {
  // Create a new component with a test stub and Storybook entry
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
  // TODO: option for non-drupal data sources
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
        path: 'src/data/queries/{{name}}.ts',
        templateFile: 'generator-templates/query/query.hbs',
      },
      {
        type: 'add',
        path: 'src/data/queries/tests/{{name}}.test.tsx',
        templateFile: 'generator-templates/query/test.hbs',
      },
      {
        type: 'add',
        path: 'src/mocks/{{camelCase name}}.mock.json',
        templateFile: 'generator-templates/query/mock.hbs',
      },
    ],
  })

  // Generate all files needed to render a new content type from Drupal.
  // This uses all of the above templates, in some different locations.
  // It also generates an additional test file for E2E testing the page via Playwright.
  // plop.setGenerator('Content Type', {
  // 	description: 'Generate boilerplate for new Page based on Content Type',
  // 	prompts: [{
  // 		type: 'input',
  // 		name: 'name',
  // 		message: 'Page name name please'
  // 	}],
  // 	actions: [
  //  {
  // 		type: 'add',
  // 		path: 'src/templates/components/{{name}}/index.tsx',
  // 		templateFile: 'generator-templates/component/index.hbs'
  // 	}]
  // });

  // Add additional generators here
}
