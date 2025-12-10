import { render } from '@testing-library/react'
import { SchemaScript } from './SchemaScript'
import drupalMockData from './mock'
import { formatter } from './query'
import { DrupalMenuLinkContent } from 'next-drupal'

const menuItem: DrupalMenuLinkContent = {
  title: 'Foo',
  type: 'meh',
  url: '/nowhere/in-particular',
  id: 'foo',
  description: 'bar',
  enabled: true,
  expanded: true,
  menu_name: 'baz',
  meta: {},
  options: {},
  parent: null,
  provider: null,
  route: null,
  weight: '0',
}

const mockMenu = {
  items: [menuItem],
  tree: [menuItem],
}

const mockData = formatter({
  entity: drupalMockData,
  menu: mockMenu,
  lovell: { isLovellVariantPage: false, variant: 'va' },
})

const getSchemaData = (props = mockData) => {
  const { container } = render(<SchemaScript {...props} />)
  const scriptTag = container.querySelector(
    'script[type="application/ld+json"]'
  )
  return JSON.parse((scriptTag as HTMLScriptElement).innerHTML)
}

describe('SchemaScript', () => {
  describe('Place schema (main structured data)', () => {
    test('renders Place schema script tag with correct structure', () => {
      const schemaData = getSchemaData()

      expect(schemaData['@context']).toBe('https://schema.org')
      expect(schemaData['@type']).toBe('Place')
      expect(schemaData.name).toBe(mockData.title)
      expect(schemaData.telephone).toBe(mockData.mainPhoneString)
      expect(schemaData.branchCode).toBe(mockData.facilityLocatorApiId)
    })

    test('includes correct address structure in Place schema', () => {
      const schemaData = getSchemaData()

      expect(schemaData.address['@type']).toBe('PostalAddress')
      expect(schemaData.address.streetAddress).toContain(
        mockData.address.address_line1
      )
      expect(schemaData.address.addressLocality).toBe(mockData.address.locality)
      expect(schemaData.address.addressRegion).toBe(
        mockData.address.administrative_area
      )
      expect(schemaData.address.postalCode).toBe(mockData.address.postal_code)
    })

    test('includes address_line2 in streetAddress when present', () => {
      const dataWithAddressLine2 = {
        ...mockData,
        address: {
          ...mockData.address,
          address_line2: 'Suite 100',
        },
      }

      const schemaData = getSchemaData(dataWithAddressLine2)

      expect(schemaData.address.streetAddress).toContain(
        mockData.address.address_line1
      )
      expect(schemaData.address.streetAddress).toContain('Suite 100')
      expect(schemaData.address.streetAddress).toContain(',')
    })

    test('excludes address_line2 from streetAddress when empty', () => {
      const dataWithoutAddressLine2 = {
        ...mockData,
        address: {
          ...mockData.address,
          address_line2: '',
        },
      }

      const schemaData = getSchemaData(dataWithoutAddressLine2)

      expect(schemaData.address.streetAddress).toBe(
        mockData.address.address_line1
      )
    })

    test('includes geolocation data in Place schema', () => {
      const schemaData = getSchemaData()

      expect(schemaData.geo['@type']).toBe('GeoCoordinates')
      expect(schemaData.geo.latitude).toBe(mockData.geoLocation.lat)
      expect(schemaData.geo.longitude).toBe(mockData.geoLocation.lon)
    })

    test('handles missing geolocation gracefully', () => {
      const dataWithoutGeo = {
        ...mockData,
        geoLocation: null,
      }

      const schemaData = getSchemaData(dataWithoutGeo)

      expect(schemaData.geo['@type']).toBe('GeoCoordinates')
      expect(schemaData.geo.latitude).toBe('')
      expect(schemaData.geo.longitude).toBe('')
    })

    test('includes hasMap URL with encoded address', () => {
      const schemaData = getSchemaData()

      expect(schemaData.hasMap).toContain('maps.google.com')
      expect(schemaData.hasMap).toContain(
        encodeURIComponent(
          `${mockData.address.address_line1}, ${mockData.address.locality}, ${mockData.address.postal_code}`
        )
      )
    })

    test('includes image URL when image is present', () => {
      const schemaData = getSchemaData()

      expect(schemaData.image).toBe(mockData.image.links['2_1_large'].href)
    })

    test('handles missing image gracefully', () => {
      const dataWithoutImage = {
        ...mockData,
        image: null,
      }

      const schemaData = getSchemaData(dataWithoutImage)

      expect(schemaData.image).toBeUndefined()
    })

    test('includes openingHoursSpecification for office hours', () => {
      const schemaData = getSchemaData()

      expect(Array.isArray(schemaData.openingHoursSpecification)).toBe(true)
      expect(schemaData.openingHoursSpecification.length).toBe(
        mockData.officeHours.length
      )

      // Check structure of first opening hours entry
      const firstHours = schemaData.openingHoursSpecification[0]
      expect(firstHours['@type']).toBe('OpeningHoursSpecification')
      expect(firstHours.dayOfWeek).toContain('https://schema.org/')
    })

    test('maps office hours correctly to schema.org format', () => {
      const schemaData = getSchemaData()

      // Find Monday (day 1) entry - dayOfWeek format is https://schema.org/Monday
      const mondayHours = schemaData.openingHoursSpecification.find(
        (hours: { dayOfWeek: string }) =>
          hours.dayOfWeek === 'https://schema.org/Monday'
      )

      expect(mondayHours).toBeDefined()
      expect(mondayHours.opens).toBeDefined()
      expect(mondayHours.closes).toBeDefined()
      // Time format should be HH:MM:00
      expect(mondayHours.opens).toMatch(/^\d{2}:\d{2}:00$/)
      expect(mondayHours.closes).toMatch(/^\d{2}:\d{2}:00$/)
    })

    test('handles null office hours gracefully', () => {
      const dataWithNullHours = {
        ...mockData,
        officeHours: [
          { day: 0, starthours: null, endhours: null, comment: 'Closed' },
        ],
      }

      const schemaData = getSchemaData(dataWithNullHours)

      expect(schemaData.openingHoursSpecification).toBeDefined()
      expect(schemaData.openingHoursSpecification.length).toBe(1)

      // The dayOfWeek format is https://schema.org/Sunday (day 0 = Sunday)
      const closedDay = schemaData.openingHoursSpecification[0]
      expect(closedDay.dayOfWeek).toBe('https://schema.org/Sunday')
      expect(closedDay.opens).toBe('')
      expect(closedDay.closes).toBe('')
    })
  })

  describe('Edge cases', () => {
    test('handles missing postal_code in address', () => {
      const dataWithoutPostalCode = {
        ...mockData,
        address: {
          ...mockData.address,
          postal_code: '',
        },
      }

      const schemaData = getSchemaData(dataWithoutPostalCode)

      expect(schemaData.address.postalCode).toBe('')
    })

    test('renders script tag with correct type attribute', () => {
      const { container } = render(<SchemaScript {...mockData} />)
      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      )
      expect(scriptTag).toBeInTheDocument()
      expect(scriptTag.getAttribute('type')).toBe('application/ld+json')
    })

    test('generates valid JSON in script tag', () => {
      const { container } = render(<SchemaScript {...mockData} />)
      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]'
      )
      expect(() => {
        JSON.parse((scriptTag as HTMLScriptElement).innerHTML)
      }).not.toThrow()
    })
  })
})
