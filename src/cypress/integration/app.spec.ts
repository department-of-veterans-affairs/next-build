// cypress/integration/app.spec.ts

describe('Navigation', () => {
    it('should navigate to the about page', () => {
        // Start from the index page
        cy.visit('http://localhost:3000/')

        // Find a link with an href attribute containing "about" and click it
        cy.get(
            'a[href*="resources/whats-a-veteran-health-id-card-vhic-and-how-do-i-get-one"]'
        ).click()

        // The new url should include "/resources"
        cy.url().should('include', '/resources')

        // The new page should contain an h2 with "vetran"
        cy.get('h2').contains('veteran')
    })
})

const asModule = {}
export default asModule
