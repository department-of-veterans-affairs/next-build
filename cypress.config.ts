/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress'
import fetch from 'cross-fetch'

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
  // these two below are for a11y tests in chromium
  numTestsKeptInMemory: 25,
  experimentalMemoryManagement: true,

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
    // 3000 is the port from `yarn build` && `yarn start`
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        // Adds a "log" task to dump output to the console.
        log(message) {
          console.log(message)
          return null
        },
        // Adds a "table" task to dump tabular output to the console.
        table(message) {
          console.table(message)
          return null
        },
        // Adds a "sitemapLocations" task to get all pages next-build is aware of
        sitemapLocations() {
          return fetch(`${config.baseUrl}/sitemap.xml`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/xml',
            },
          })
            .then((res) => res.text())
            .then((xml) => {
              const locs = [
                ...xml.matchAll(new RegExp(`<loc>(.|\n)*?</loc>`, 'g')),
              ].map(([loc]) => loc.replace('<loc>', '').replace('</loc>', ''))
              return locs
            })
        },
      })
    },
  },
})
