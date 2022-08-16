import { render, screen } from 'test-utils'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import mock_banner_alert from './nodeBannerAlert.json'
import { NodeBannerAlert } from '@/types/dataTypes/drupal/node'

const nodeBannerAlert: NodeBannerAlert = mock_banner_alert

describe('<FacilityBanner> component renders', () => {
  test('with valid data', () => {
    const { container } = render(<FacilityBanner {...nodeBannerAlert} />)
    const aEl = container.querySelectorAll('a')

    expect(screen.queryByText(/COVID-19 vaccines:/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'Coronavirus'
    )
    expect(aEl[0]).toHaveAttribute(
      'href',
      '/wilkes-barre-health-care/programs/covid-19-vaccines'
    )
    expect(aEl[0]).toHaveAttribute('data-entity-substitution', 'canonical')
    expect(aEl[0]).toHaveAttribute('title', 'COVID-19 vaccines')
    expect(
      screen.queryByText(/Visit our vaccine information page/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Find other VA facilities near you/)
    ).toBeInTheDocument()
  })

  test('region == vamcs.field_office.path.alias', () => {
    nodeBannerAlert.path.alias = '/wilkes-barre-health-care'
    const { container } = render(<FacilityBanner {...nodeBannerAlert} />)
    const aEl = container.querySelectorAll('a')

    expect(screen.queryByText(/COVID-19 vaccines:/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'Coronavirus'
    )
    expect(aEl[0]).toHaveAttribute(
      'href',
      '/wilkes-barre-health-care/programs/covid-19-vaccines'
    )
    expect(screen.getByRole('va-banner')).toHaveAttribute('visible', 'true')
    expect(aEl[0]).toHaveAttribute('title', 'COVID-19 vaccines')
    expect(
      screen.queryByText(/Find other VA facilities near you/)
    ).toBeInTheDocument()
  })

  test('without field_banner_alert_vamcs', () => {
    nodeBannerAlert.field_banner_alert_vamcs = null
    const { container } = render(<FacilityBanner {...nodeBannerAlert} />)
    const aEl = container.querySelectorAll('a')

    expect(screen.queryByText(/COVID-19 vaccines:/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'Coronavirus'
    )
    expect(aEl[0]).toHaveAttribute(
      'href',
      '/wilkes-barre-health-care/programs/covid-19-vaccines'
    )
    expect(aEl[0]).toHaveAttribute('title', 'COVID-19 vaccines')
  })

  test('without field_alert_operating_status_cta', () => {
    nodeBannerAlert.field_alert_operating_status_cta = null
    const { container } = render(<FacilityBanner {...nodeBannerAlert} />)
    const aEl = container.querySelectorAll('a')

    expect(screen.queryByText(/COVID-19 vaccines:/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'Coronavirus'
    )
    expect(aEl[0]).toHaveAttribute(
      'href',
      '/wilkes-barre-health-care/programs/covid-19-vaccines'
    )
    expect(aEl[0]).toHaveAttribute('title', 'COVID-19 vaccines')
  })

  test('without field_alert_find_facilities_cta', () => {
    nodeBannerAlert.field_alert_find_facilities_cta = false
    render(<FacilityBanner {...nodeBannerAlert} />)

    expect(screen.queryByText(/COVID-19 vaccines:/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Find other VA facilities near you/)
    ).not.toBeInTheDocument()
  })
})

describe('<FacilityBanner> component does not render', () => {
  test('without node data', () => {
    render(<FacilityBanner {...nodeBannerAlert} />)
    expect(screen.queryByText(/COVID-19 vaccines:/)).not.toBeInTheDocument()
  })

  test.skip('when hideOnSubpages = true', () => {
    nodeBannerAlert.field_alert_inheritance_subpages = true
    nodeBannerAlert.path.alias = '/lastArg'
    render(<FacilityBanner {...nodeBannerAlert} />)

    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute('visible', 'true')
  })
})
