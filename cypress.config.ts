/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress'
import fetch from 'cross-fetch'
import './scripts/env-handler'

export default defineConfig({
  env: {
    failSilently: false,
  },
  screenshotsFolder: 'cypress/screenshots/actual',
  trashAssetsBeforeRuns: true,
  videoCompression: false,
  videosFolder: 'cypress/videos',
  viewportHeight: 900,
  retries: {
    // `yarn test:cypress`
    runMode: 0,
    // `yarn test:cypress:interactive
    openMode: 0,
  },

  pageLoadTimeout: 240000,

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
    // 8001 is the port from `yarn export` && `yarn export:serve`
    baseUrl: process.env.SITE_URL || 'https://localhost:8001',
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
