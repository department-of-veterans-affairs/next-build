/// <reference types="cypress" />

context('News Story', () => {
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
