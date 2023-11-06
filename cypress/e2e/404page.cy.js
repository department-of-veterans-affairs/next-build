/// <reference types="cypress" />

context('404 Error Page', () => {
  it('Displays the 404 Error page content', () => {
    cy.visit('/non-existent-page')

    // Check that the main elements of 404 page are present
    cy.get('h3').contains('Sorry — we can’t find that page')
    cy.get('p').contains(
      'Try the search box or one of the common questions below.'
    )

    // Check that the search box is present
    cy.get('form#search_form').should('exist')

    // Check that the "Common and Popular" section is rendered
    cy.get('.va-quicklinks--commpop').should('exist')
  })

  it.skip('Should render without a11y accessibility errors', () => {
    cy.visit('/non-existent-page')
    cy.testA11y()
  })
})
