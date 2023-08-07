/// <reference types="cypress" />

context('News Story', () => {
  it('News story listing page renders with stories that can be navigated to', () => {
    cy.visit('/butler-health-care/stories')

    cy.get('.usa-unstyled-list').contains('Helpful Reminders').click()
    cy.location('pathname').should('include', 'helpful')
  })

  it('Should render a message if there are no stories', () => {
    cy.visit('/portland-health-care/stories')
    cy.get('.usa-unstyled-list').should('have.text', 'No stories at this time.')
  })
})
