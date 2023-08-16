// This runs an accessibility scan using cypress-axe over every page in the sitemap

it('the site should be accessible', () => {
  cy.task('sitemapLocations').then((urls) => {
    urls.forEach((url) => {
      cy.visit(url)
      cy.task('log', `Now testing: ${url}`)
      cy.testA11y(true, { url }) // need to pass skipFailures boolean to check all pages
    })
  })
})
