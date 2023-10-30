/// <reference types="cypress" />
import { features, vamcEhr } from './mocks'
context('News Story', () => {
  beforeEach(() => {
    cy.intercept('/data/cms/vamc-ehr*', vamcEhr).as('facilityData')
    cy.intercept('/v0/feature_toggles*', features).as('features')
    cy.intercept('/js-report/api/*', {}).as('sentry')
  })

  it('News Story page renders with navigation back to parent story list', () => {
    cy.visit('/butler-health-care/stories/its-flu-shot-time/')

    cy.get('#news-stories-listing-link').click()
    cy.location('pathname').should('equal', '/butler-health-care/stories/')
  })

  it.skip('Should render without a11y errors', () => {
    cy.visit('/butler-health-care/stories/its-flu-shot-time/')

    cy.testA11y()
  })
})
