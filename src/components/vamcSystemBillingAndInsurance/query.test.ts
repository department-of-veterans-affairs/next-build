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

  it('formats aboveTopOfPageContent field correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.aboveTopOfPageContent).toBeDefined()
    expect(result.aboveTopOfPageContent?.html).toContain(
      '<h2>Questions about copay balance</h2>'
    )
    expect(result.aboveTopOfPageContent?.html).toContain(
      'For questions about the copay balance of your VA health care bill'
    )
  })

  it('formats relatedLinks field correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.relatedLinks).toBeDefined()
    expect(result.relatedLinks.title).toBe('More information')
    expect(result.relatedLinks.linkTeasers).toHaveLength(4)
    expect(result.relatedLinks.linkTeasers[0].title).toBe(
      'VA health care copay rates'
    )
    expect(result.relatedLinks.linkTeasers[0].summary).toBe(
      'Review copay rates for outpatient care, hospital stays, medications, and other health services.'
    )
  })

  it('formats services array correctly and sorts them alphabetically', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.services).toBeDefined()
    expect(result.services).toHaveLength(1)

    const service = result.services[0]
    expect(service.id).toBe('329cf348-dc5a-486a-8733-700703b9b35f')
    expect(service.title).toBe(
      "Louis A. Johnson Veterans' Administration Medical Center"
    )
    expect(service.path).toBe(
      '/clarksburg-health-care/locations/louis-a-johnson-veterans-administration-medical-center'
    )
    expect(service.address).toEqual({
      langcode: 'en',
      country_code: 'US',
      administrative_area: 'WV',
      locality: 'Clarksburg',
      dependent_locality: null,
      postal_code: '26301-4155',
      address_line1: '1 Medical Center Drive',
      additional_name: null,
    })
    expect(service.phoneNumber).toBe('304-623-3461')
    expect(service.serviceLocations).toHaveLength(1)
    expect(service.serviceLocations[0]).toBeDefined()
  })

  it('formats officeHours field correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.officeHours).toBeDefined()
    expect(result.officeHours).toHaveLength(5)
    expect(result.officeHours[0]).toEqual({
      day: 1,
      all_day: false,
      starthours: 800,
      endhours: 1630,
      comment: '',
    })
    expect(result.officeHours[4]).toEqual({
      day: 5,
      all_day: false,
      starthours: 800,
      endhours: 1630,
      comment: '',
    })
  })

  it('formats phoneNumber field correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.phoneNumber).toBeDefined()
    expect(result.phoneNumber).toBeNull() // field_telephone is null in mock data
  })

  it('sorts services alphabetically by title', () => {
    const unsortedServices = [
      {
        ...mockServices[0],
        field_facility_location: {
          ...mockServices[0].field_facility_location,
          title: 'Zebra Medical Center',
        },
      },
      {
        ...mockServices[0],
        field_facility_location: {
          ...mockServices[0].field_facility_location,
          title: 'Alpha Medical Center',
        },
      },
    ]

    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: unsortedServices,
    })

    expect(result.services).toHaveLength(2)
    expect(result.services[0].title).toBe('Alpha Medical Center')
    expect(result.services[1].title).toBe('Zebra Medical Center')
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
