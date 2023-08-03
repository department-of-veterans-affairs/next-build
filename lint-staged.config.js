module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'yarn test:types',

  // IDE may warn about a duplicate key, but need to be separate for correct env handling.
  // Lint and format TypeScript and JavaScript files
  '*.(ts|tsx|js|jsx)': (filenames) => [
    `yarn lint --fix --file ${filenames
      .map((file) => file.split(process.cwd())[1])
      .join(' --file ')}`,
    `yarn prettier ${filenames.join(' ')} --write`,
  ],

  // Run unit tests relating to modified files.
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `jest --findRelatedTests ${filenames.join(' ')} --passWithNoTests`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')}`,
}
