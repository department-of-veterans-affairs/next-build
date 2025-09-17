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

  describe('Lovell variant handling', () => {
    const lovellPath = {
      alias: '/lovell-federal-health-care-va/billing-and-insurance',
      pid: 79642,
      langcode: 'en',
    }
    const lovellBreadcrumbs = [
      {
        uri: 'https://va-gov-cms.ddev.site/',
        title: 'Home',
        options: [],
      },
      {
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care',
        title: 'Lovell Federal health care',
        options: [],
      },
      {
        uri: 'internal:#',
        title: 'Billing and insurance',
        options: [],
      },
    ]

    it('outputs formatted data with Lovell variant', () => {
      const result = formatter({
        entity: {
          ...mockData,
          path: lovellPath,
        },
        menu: mockMenu as unknown as Menu,
        services: mockServices,
        lovell: {
          isLovellVariantPage: true,
          variant: 'tricare',
        },
      })

      expect(result.lovellVariant).toBe('tricare')
      expect(result.lovellSwitchPath).toBe(
        '/lovell-federal-health-care-va/billing-and-insurance'
      )
    })

    it('updates the breadcrumbs for Lovell variant', () => {
      const result = formatter({
        entity: {
          ...mockData,
          path: lovellPath,
          breadcrumbs: lovellBreadcrumbs,
        },
        menu: mockMenu as unknown as Menu,
        services: mockServices,
        lovell: {
          isLovellVariantPage: true,
          variant: 'tricare',
        },
      })

      expect(result.breadcrumbs[1]).toEqual({
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care-tricare',
        title: 'Lovell Federal health care - TRICARE',
        options: [],
      })
    })

    it('does not modify breadcrumbs when not a Lovell variant page', () => {
      const result = formatter({
        entity: {
          ...mockData,
          path: lovellPath,
          breadcrumbs: lovellBreadcrumbs,
        },
        menu: mockMenu as unknown as Menu,
        services: mockServices,
        lovell: {
          isLovellVariantPage: false,
          variant: 'va',
        },
      })

      expect(result.breadcrumbs).toEqual(lovellBreadcrumbs)
    })

    it('handles null lovell context', () => {
      const result = formatter({
        entity: {
          ...mockData,
          path: lovellPath,
          breadcrumbs: lovellBreadcrumbs,
        },
        menu: mockMenu as unknown as Menu,
        services: mockServices,
        lovell: null,
      })

      expect(result.breadcrumbs).toEqual(lovellBreadcrumbs)
      expect(result.lovellVariant).toBeNull()
      expect(result.lovellSwitchPath).toBeNull()
    })
  })
})
