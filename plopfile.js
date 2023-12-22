// run `yarn plop` to use generators defined in this file
module.exports = function (plop) {
  // create your generators here
  plop.setGenerator('Component', {
    description: 'New React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/templates/components/{{name}}/index.tsx',
        templateFile: 'generator-templates/component/index.hbs',
      },
    ],
  })

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
    ],
  })

  // plop.setGenerator('Content Type', {
  // 	description: 'Generate boilerplate for new Page based on Content Type',
  // 	prompts: [{
  // 		type: 'input',
  // 		name: 'name',
  // 		message: 'Page name name please'
  // 	}],
  // 	actions: [{
  // 		type: 'add',
  // 		path: 'src/templates/components/{{name}}/index.tsx',
  // 		templateFile: 'generator-templates/component/index.hbs'
  // 	}]
  // });
}
