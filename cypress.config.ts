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
    // todo: env handling for local vs CI
    // 8001 is the port from `yarn export:serve`
    baseUrl: 'http://localhost:8001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
