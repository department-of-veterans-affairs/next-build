module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'yarn tsc --noEmit',

  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `yarn eslint --fix ${filenames.join(' ')}`,
    `yarn prettier --write ${filenames.join(' ')}`,
  ],

  // Run unit tests relating to modified files
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `jest --findRelatedTests ${filenames.join(' ')}`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json|ts|tsx|js|jsx)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')}`,
}
