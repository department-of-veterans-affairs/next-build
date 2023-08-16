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

  includeShadowDom: false,

  // from content-build
  viewportWidth: 1920,
  viewportHeight: 1080,
  modifyObstructiveCode: false,
  waitForAnimations: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  retries: {
    runMode: 2,
    openMode: 0,
  },

  // these two below are for a11y tests in chromium
  numTestsKeptInMemory: 25,
  experimentalMemoryManagement: true,

  e2e: {
    // todo: env handling for local vs CI
    // 8001 is the port from `yarn export:serve`
    baseUrl: 'http://127.0.0.1:8001',
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
