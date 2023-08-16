// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-axe'
import '@testing-library/cypress/add-commands'

// use consistent axe settings for a11y checks everywhere
Cypress.Commands.add('testA11y', (skipFailures: false) => {
  cy.injectAxe()

  cy.configureAxe({
    iframes: false,
    runOnly: {
      type: 'tag',
      values: [
        'section508',
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'best-practice',
      ],
      resultTypes: ['violations'],
    },
    rules: [
      {
        id: 'color-contrast',
        enabled: false,
      },
    ],
  })

  // skipFailures can be set to true in order to scan multiple pages in a single test
  cy.checkA11y(null, null, terminalLog, skipFailures)
})

// Adds readable a11y violation info to the terminal log
function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )

  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes, help, helpUrl }) => {
      // which selector(s) caused the error
      const target =
        nodes.target ||
        nodes
          .map((n) => n.target)
          .flat(2)
          .join(' ')
      return {
        axeRuleId: id,
        impact,
        description,
        targetElement: target,
        help,
        helpUrl,
      }
    }
  )

  cy.task('table', violationData)
}
