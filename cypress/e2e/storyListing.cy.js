/// <reference types="cypress" />

context('Story Listing', () => {
  it('Story Listing page renders with stories that can be navigated to', () => {
    cy.visit('butler-health-care/stories')

    cy.get('.usa-unstyled-list a').first().click()
    cy.location('pathname').should('include', '/butler-health-care/stories/')
  })

  it('Story Listing pages should be paginated if there are more than 10 stories', () => {
    cy.visit('eastern-oklahoma-health-care/stories')
    // .shadow() required to check shadow DOM content
    cy.get('va-pagination').shadow().contains('2').click()
    cy.location('pathname').should('include', '/page-2/')

    cy.get('va-pagination').shadow().contains('Next').click()
    cy.location('pathname').should('include', '/page-3/')
  })

  it('Should render a message if there are no stories', () => {
    cy.visit('portland-health-care/stories')
    cy.get('.usa-unstyled-list').should('have.text', 'No stories at this time.')
  })

  it.skip('Should render without a11y errors', () => {
    cy.visit('butler-health-care/stories')

    cy.testA11y()
  })
})
