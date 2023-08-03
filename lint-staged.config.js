module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'yarn test:types',

  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `yarn lint --fix ${filenames.join(' ')}`,
    `yarn prettier --write ${filenames.join(' ')}`,
  ],

  // Run unit tests relating to modified files
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `jest --findRelatedTests ${filenames.join(' ')}`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')}`,
}
