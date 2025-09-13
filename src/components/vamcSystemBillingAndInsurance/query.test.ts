/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import { formatter } from './query'
import mockData from './mock.json'
import mockMenu from './mock.menu.json'
import mockServices from './mock.services.json'
import { Menu } from '@/types/drupal/menu'

describe('VamcSystemBillingAndInsurance formatter', () => {
  it('formats basic fields correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.title).toBe('Billing and insurance')
    expect(result.entityId).toBe(45617)
    expect(result.entityPath).toBe(
      '/louisville-health-care/billing-and-insurance'
    )
    expect(result.vamcSystem.title).toBe('VA Louisville health care')
    expect(result.menu).toBeDefined()
    expect(result.menu.rootPath).toBe(
      '/louisville-health-care/billing-and-insurance/'
    )
  })

  it('formats topOfPageContent field correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.topOfPageContent).toBeDefined()
    expect(result.topOfPageContent.html).toContain(
      '<h2 id="pay-online-by-phoneor-mail">Pay online, by phone, or mail</h2>'
    )
  })

  it('formats bottomOfPageContent field correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.bottomOfPageContent).toBeDefined()
    expect(result.bottomOfPageContent.html).toContain(
      '<h2 id="private-and-other-health-insur">Private and other health insurance</h2>'
    )
  })
})
