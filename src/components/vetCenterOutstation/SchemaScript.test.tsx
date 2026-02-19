import { render } from '@testing-library/react'
import { SchemaScript } from './SchemaScript'
import { mockData } from './mock.formatted'
import { VetCenterOutstation } from './formatted-type'

describe('SchemaScript', () => {
  describe('Place schema (main structured data)', () => {
    test('renders Place schema script tag with correct structure', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      expect(scriptTags.length).toBeGreaterThan(0)

      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData['@context']).toBe('https://schema.org')
      expect(schemaData['@type']).toBe('Place')
      expect(schemaData.name).toBe(mockData.title)
      expect(schemaData.telephone).toBe(mockData.phoneNumber)
      expect(schemaData.branchCode).toBe(mockData.fieldFacilityLocatorApiId)
    })

    test('includes correct address structure in Place schema', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.address['@type']).toBe('PostalAddress')
      expect(schemaData.address.streetAddress).toBe('1010 Delafield Road')
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

      const { container } = render(
        <SchemaScript vetCenterOutstation={dataWithAddressLine2} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.address.streetAddress).toBe(
        '1010 Delafield Road, Suite 100'
      )
    })

    test('excludes address_line2 from streetAddress when empty', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.address.streetAddress).toBe('1010 Delafield Road')
      expect(schemaData.address.streetAddress).not.toContain(',')
    })

    test('includes geolocation data in Place schema', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.geo['@type']).toBe('GeoCoordinates')
      expect(schemaData.geo.latitude).toBe(mockData.geolocation.lat.toString())
      expect(schemaData.geo.longitude).toBe(mockData.geolocation.lon.toString())
    })

    test('includes hasMap URL with encoded address', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.hasMap).toContain('maps.google.com')
      expect(schemaData.hasMap).toContain(
        encodeURIComponent(
          `${mockData.address.address_line1}, ${mockData.address.locality}, ${mockData.address.postal_code}`
        )
      )
    })

    test('includes image URL when image is present', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.image).toBe(mockData.image.links['2_1_large'].href)
    })

    test('handles missing image gracefully', () => {
      const dataWithoutImage = {
        ...mockData,
        image: null,
      }

      const { container } = render(
        <SchemaScript
          vetCenterOutstation={dataWithoutImage as VetCenterOutstation}
        />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.image).toBeUndefined()
    })

    test('includes openingHoursSpecification for office hours', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(Array.isArray(schemaData.openingHoursSpecification)).toBe(true)
      expect(schemaData.openingHoursSpecification.length).toBe(
        mockData.officeHours.length
      )

      const firstHours = schemaData.openingHoursSpecification[0]
      expect(firstHours['@type']).toBe('OpeningHoursSpecification')
      expect(firstHours.dayOfWeek).toContain('schema.org')
    })

    test('maps office hours correctly to schema.org format', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      const mondayHours = schemaData.openingHoursSpecification.find(
        (hours: { dayOfWeek: string }) =>
          hours.dayOfWeek === 'https://schema.org/1'
      )

      expect(mondayHours).toBeDefined()
      expect(mondayHours.opens).toBe(800)
      expect(mondayHours.closes).toBe(1630)
    })
  })

  describe('GovernmentService schema (health services)', () => {
    test('renders GovernmentService schema for each health service', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      expect(scriptTags.length).toBe(1 + mockData.healthServices.length)

      const serviceSchemas = Array.from(scriptTags)
        .slice(1)
        .map((script) => JSON.parse((script as HTMLScriptElement).innerHTML))

      expect(serviceSchemas.length).toBe(mockData.healthServices.length)
      serviceSchemas.forEach((schema) => {
        expect(schema['@context']).toBe('https://schema.org')
        expect(schema['@type']).toBe('GovernmentService')
      })
    })

    test('includes correct service information in GovernmentService schema', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      expect(firstServiceSchema.name).toBe(mockData.title)
      expect(firstServiceSchema.serviceType).toBe(
        mockData.healthServices[0].vetCenterTypeOfCare
      )
    })

    test('includes serviceOperator in GovernmentService schema', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      expect(firstServiceSchema.serviceOperator['@type']).toBe(
        'GovernmentOrganization'
      )
      expect(firstServiceSchema.serviceOperator.name).toBe(
        'US Department of Veterans Affairs'
      )
    })

    test('includes areaServed with administrative area', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      expect(firstServiceSchema.areaServed['@type']).toBe('AdministrativeArea')
      expect(firstServiceSchema.areaServed.name).toBe(
        mockData.address.administrative_area
      )
    })

    test('includes audience information', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      expect(firstServiceSchema.audience['@type']).toBe('Audience')
      expect(firstServiceSchema.audience.audienceType).toBe('Veteran')
    })

    test('includes availableChannel with service information', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      expect(firstServiceSchema.availableChannel['@type']).toBe(
        'ServiceChannel'
      )
      expect(firstServiceSchema.availableChannel.serviceUrl).toBe(
        'https://www.va.gov'
      )
    })

    test('includes serviceLocation with Place information', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      const serviceLocation = firstServiceSchema.serviceLocation
      expect(serviceLocation['@type']).toBe('Place')
      expect(serviceLocation.name).toBe(mockData.title)
      expect(serviceLocation.address['@type']).toBe('PostalAddress')
      expect(serviceLocation.address.addressLocality).toBe(
        mockData.address.locality
      )
      expect(serviceLocation.address.addressRegion).toBe(
        mockData.address.administrative_area
      )
      expect(serviceLocation.address.postalCode).toBe(
        mockData.address.postal_code
      )
    })

    test('includes geo coordinates in serviceLocation', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      const geo = firstServiceSchema.serviceLocation.geo
      expect(geo['@type']).toBe('GeoCoordinates')
      expect(geo.latitude).toBe(mockData.geolocation.lat.toString())
      expect(geo.longitude).toBe(mockData.geolocation.lon.toString())
    })

    test('includes provider information', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      expect(firstServiceSchema.provider['@type']).toBe(
        'GovernmentOrganization'
      )
      expect(firstServiceSchema.provider.name).toBe('Veterans Affairs')
      expect(firstServiceSchema.provider.url).toBe('https://www.va.gov')
    })

    test('handles alternateName when vetCenterFriendlyName is present', () => {
      const dataWithFriendlyName = {
        ...mockData,
        healthServices: [
          {
            ...mockData.healthServices[0],
            vetCenterFriendlyName: 'PTSD Counseling Services',
          },
        ],
      }

      const { container } = render(
        <SchemaScript vetCenterOutstation={dataWithFriendlyName} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      expect(firstServiceSchema.alternateName).toBe('PTSD Counseling Services')
    })

    test('sets alternateName to null when vetCenterFriendlyName is missing', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      const firstServiceSchema = JSON.parse(
        (scriptTags[1] as HTMLScriptElement).innerHTML
      )

      expect(firstServiceSchema.alternateName).toBeNull()
    })

    test('handles empty health services array', () => {
      const dataWithoutHealthServices = {
        ...mockData,
        healthServices: [],
      }

      const { container } = render(
        <SchemaScript vetCenterOutstation={dataWithoutHealthServices} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      expect(scriptTags.length).toBe(1)
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

      const { container } = render(
        <SchemaScript vetCenterOutstation={dataWithoutPostalCode} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.address.postalCode).toBe('')
    })

    test('handles null office hours gracefully', () => {
      const dataWithNullHours = {
        ...mockData,
        officeHours: [
          { day: 0, starthours: null, endhours: null, comment: 'Closed' },
        ],
      }

      const { container } = render(
        <SchemaScript vetCenterOutstation={dataWithNullHours} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )
      const firstScript = scriptTags[0]
      const schemaData = JSON.parse(
        (firstScript as HTMLScriptElement).innerHTML
      )

      expect(schemaData.openingHoursSpecification).toBeDefined()
      expect(schemaData.openingHoursSpecification.length).toBe(1)

      const closedDay = schemaData.openingHoursSpecification[0]
      expect(closedDay.dayOfWeek).toBe('https://schema.org/0')
      expect(closedDay.opens).toBeNull()
      expect(closedDay.closes).toBeNull()
    })

    test('renders all script tags with correct type attribute', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      scriptTags.forEach((script) => {
        expect(script.getAttribute('type')).toBe('application/ld+json')
      })
    })

    test('generates valid JSON in all script tags', () => {
      const { container } = render(
        <SchemaScript vetCenterOutstation={mockData} />
      )

      const scriptTags = container.querySelectorAll(
        'script[type="application/ld+json"]'
      )

      scriptTags.forEach((script) => {
        expect(() => {
          JSON.parse((script as HTMLScriptElement).innerHTML)
        }).not.toThrow()
      })
    })
  })
})
