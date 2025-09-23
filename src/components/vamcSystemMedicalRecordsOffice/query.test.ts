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
import { VamcSystemMedicalRecordsOfficeData } from './query'

const defaultData: VamcSystemMedicalRecordsOfficeData = {
  entity: mockData,
  // @ts-expect-error - the `options` type of this real data is not compatible with that
  // of the `DrupalMenuLinkContent` definition from `next-drupal`
  menu: mockMenu as Menu,
  services: mockServices,
}

describe('VamcSystemMedicalRecordsOffice formatter', () => {
  it('formats basic fields correctly', () => {
    const result = formatter(defaultData)

    expect(result.title).toBe('Medical records office')
    expect(result.entityId).toBe(45806)
    expect(result.entityPath).toBe(
      '/beckley-health-care/medical-records-office'
    )
    expect(result.vamcSystem.title).toBe('VA Beckley health care')
    expect(result.menu).toBeDefined()
    expect(result.menu.rootPath).toBe(
      '/beckley-health-care/medical-records-office/'
    )
  })

  it('formats topOfPageContent field correctly', () => {
    const result = formatter(defaultData)

    expect(result.topOfPageContent).toBeDefined()
    expect(result.topOfPageContent.html).toContain(
      '<h2 id="get-your-records-online">Get your records online</h2>'
    )
  })

  it('formats bottomOfPageContent field correctly', () => {
    const result = formatter(defaultData)

    expect(result.bottomOfPageContent).toBeNull()
  })

  it('formats relatedLinks field correctly', () => {
    const result = formatter(defaultData)

    expect(result.relatedLinks).toBeDefined()
    expect(result.relatedLinks.title).toBe('More information')
    expect(result.relatedLinks.linkTeasers).toHaveLength(4)
    expect(result.relatedLinks.linkTeasers[0].title).toBe(
      'Change your address on file with VA'
    )
    expect(result.relatedLinks.linkTeasers[0].summary).toBe(
      'Find out how to change your address and other information in your VA.gov profile. This will update your information across several VA benefits and services.'
    )
  })

  it('formats services array correctly and sorts them alphabetically', () => {
    const result = formatter(defaultData)

    expect(result.services).toBeDefined()
    expect(result.services).toHaveLength(1)

    const service = result.services[0]
    expect(service.id).toBe('209b73cd-22e9-4cd4-901f-99e1b3c9fff0')
    expect(service.title).toBe('Toledo VA Clinic')
    expect(service.path).toBe(
      '/ann-arbor-health-care/locations/toledo-va-clinic'
    )
    expect(service.address).toEqual({
      langcode: null,
      country_code: 'US',
      administrative_area: 'OH',
      locality: 'Toledo',
      dependent_locality: null,
      postal_code: '43614-5903',
      address_line1: '1200 South Detroit Avenue',
      additional_name: null,
    })
    expect(service.phoneNumber).toBe('419-259-2000')
    expect(service.serviceLocations).toHaveLength(1)
    expect(service.serviceLocations[0]).toBeDefined()
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

    const result = formatter({ ...defaultData, services: unsortedServices })

    expect(result.services).toHaveLength(2)
    expect(result.services[0].title).toBe('Alpha Medical Center')
    expect(result.services[1].title).toBe('Zebra Medical Center')
  })

  describe('Lovell variant handling', () => {
    const lovellPath = {
      alias: '/lovell-federal-health-care-va/medical-records-office',
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
        title: 'Medical records office',
        options: [],
      },
    ]

    it('outputs formatted data with Lovell variant', () => {
      const result = formatter({
        ...defaultData,
        entity: {
          ...mockData,
          path: lovellPath,
        },
        lovell: {
          isLovellVariantPage: true,
          variant: 'tricare',
        },
      })

      expect(result.lovellVariant).toBe('tricare')
      expect(result.lovellSwitchPath).toBe(
        '/lovell-federal-health-care-va/medical-records-office'
      )
    })

    it('updates the breadcrumbs for Lovell variant', () => {
      const result = formatter({
        ...defaultData,
        entity: {
          ...mockData,
          path: lovellPath,
          breadcrumbs: lovellBreadcrumbs,
        },
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
        ...defaultData,
        entity: {
          ...mockData,
          path: lovellPath,
          breadcrumbs: lovellBreadcrumbs,
        },
        lovell: {
          isLovellVariantPage: false,
          variant: 'va',
        },
      })

      expect(result.breadcrumbs).toEqual(lovellBreadcrumbs)
    })

    it('handles null lovell context', () => {
      const result = formatter({
        ...defaultData,
        entity: {
          ...mockData,
          path: lovellPath,
          breadcrumbs: lovellBreadcrumbs,
        },
        lovell: null,
      })

      expect(result.breadcrumbs).toEqual(lovellBreadcrumbs)
      expect(result.lovellVariant).toBeNull()
      expect(result.lovellSwitchPath).toBeNull()
    })
  })
})
