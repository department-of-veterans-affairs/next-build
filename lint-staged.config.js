module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'yarn test:types',

  // IDE may warn about a duplicate key, but need to be separate for correct env handling.
  // Lint TypeScript and JavaScript files
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `yarn lint --fix ${filenames.join(' ')}`,
  ],

  // Format staged files
  '**/*.(ts|tsx|js|jsx)': (filenames) =>
    filenames.map((filename) => `yarn prettier --write '${filename}'`),

  // Run unit tests relating to modified files.
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `jest --findRelatedTests ${filenames.join(' ')} --passWithNoTests`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')}`,
}
