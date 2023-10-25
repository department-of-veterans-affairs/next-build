// ***********************************************************
// This example support/index.js is processed and
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

import './commands'

beforeEach(() => {
  // Requests to Google Tag Manager can cause spurious test failures.
  cy.intercept('https://www.googletagmanager.com/gtm.js**', {
    statusCode: 200,
    body: '',
    headers: {
      'x-response-header': 'ha ha ha disregard this',
    },
  })
})
