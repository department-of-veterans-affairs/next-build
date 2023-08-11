// This runs an accessibility scan using cypress-axe over every page in the sitemap

it('the site should be accessible', () => {
  cy.task('sitemapLocations').then((pages) => {
    pages.forEach((page) => {
      cy.visit(page)
      cy.task('log', `Now testing: ${page}`)
      cy.testA11y(true) // need to pass skipFailures boolean to check all pages
    })
  })
})
