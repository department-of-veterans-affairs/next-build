// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { features, vamcEhr } from './mocks'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// remove this once we have CORS and all that vets-website stuff figured out
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

beforeEach(() => {
  cy.intercept('/data/cms/vamc-ehr*', vamcEhr).as('facilityData')
  cy.intercept('/v0/feature_toggles*', features).as('features')
  cy.intercept('js-report/api/*', {}).as('sentry')
  // cy.intercept('/v0/maintenance_windows', {
  //   data: [],
  // }).as('maintenanceWindows')
  // cy.intercept('POST', 'https://www.google-analytics.com/*', {}).as(
  //   'analytics'
  // )
})
