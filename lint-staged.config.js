module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'yarn test:types',

  // IDE may warn about a duplicate key, but need to be separate for correct env handling.
  // Lint and format TypeScript and JavaScript files
  '*.(ts|tsx|js|jsx)': (filenames) => [
    // some extra handling to use next's eslint https://github.com/vercel/next.js/issues/27997#issuecomment-900554790
    `yarn lint --fix --file ${filenames
      .map((file) => file.split(process.cwd())[1])
      .join(' --file ')}`,
    `yarn prettier ${filenames.join(' ')} --write`,
  ],

  // Run unit tests relating to modified files.
  // todo: Jest should be able to ignore files that don't need tests (*.stories.*, config, etc)
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `jest --findRelatedTests ${filenames.join(' ')} --passWithNoTests`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) =>
    `yarn prettier ${filenames.join(' ')} --write`,
}
