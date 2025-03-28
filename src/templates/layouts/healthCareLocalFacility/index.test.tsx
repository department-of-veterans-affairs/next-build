import { render, screen } from '@testing-library/react'
import { HealthCareLocalFacility } from './index'
import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'

const mockData: FormattedHealthCareLocalFacility = {
  id: '123',
  title: 'Test facility',
  type: 'node--health_care_local_facility',
  published: true,
  lastUpdated: '',
  introText: 'Test intro text',
  operatingStatusFacility: 'normal',
  menu: {
    rootPath: '/test-nav-path',
    data: {
      name: 'test-nav',
      description: 'test-nav-description',
      links: [
        {
          url: {
            path: '/test-nav-path',
          },
          description: 'test-nav-description',
          expanded: true,
          label: 'test-nav-label',
          links: [],
        },
      ],
    },
  },
}

describe('HealthCareLocalFacility with valid data', () => {
  test('renders HealthCareLocalFacility component with basic data', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    const basicDataFields: Array<keyof FormattedHealthCareLocalFacility> = [
      'title',
      'introText',
    ]
    basicDataFields.forEach((key) =>
      expect(screen.getByText(mockData[key])).toBeInTheDocument()
    )
  })

  // Once window.sideNav is populated, the static-pages app will render the menu
  // in the nav[data-widget-type="side-nav"] element, but testing for that
  // render would require side-loading that app bundle, which is outside the
  // scope of this unit test
  test('adds the sideNav to window.sideNav', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    // @ts-expect-error window.sideNav is not a default window property, but
    // we're adding it
    expect(window.sideNav).toEqual(mockData.menu)
  })
})
