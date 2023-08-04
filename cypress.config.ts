// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    failSilently: false,
  },

  screenshotsFolder: 'cypress/screenshots/actual',
  trashAssetsBeforeRuns: true,
  videoCompression: false,
  videosFolder: 'cypress/videos',
  videoUploadOnPasses: false,
  viewportHeight: 900,

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'src/.*/__tests__/.*spec.tsx',
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
