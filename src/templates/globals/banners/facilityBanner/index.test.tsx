import { render, screen } from 'test-utils'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import { FacilityBannerType } from '@/types/index'

const bannerData: FacilityBannerType = {
  id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
  title: 'Help Limit the Spread of COVID-19 and other Illnesses',
  body: '<p><strong>IMPORTANT UPDATES FROM VA PITTSBURGH</strong></p>\n\n<p>In-person visitation for COVID-negative inpatients at University Drive is limited to two visitors per patient during specified hours. Outpatients can bring a support person to clinic appointments and procedures. We require all entrants to wear a VA-provided procedure mask. For more information, please see <a href="https://gcc02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.va.gov%2Fpittsburgh-health-care%2Foperating-statu...',
  fieldAlertType: 'information',
  dismiss: true,
  operatingStatus: true,
  inheritanceSubpages: null,
  path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
  bannerAlertVacms: [
    {
      id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
      title: 'Help Limit the Spread of COVID-19 and other Illnesses',
    },
  ],
  type: 'node--full_width_banner_alert',
}

describe('<FacilityBanner> component renders', () => {
  test('with valid data', () => {
    const { container } = render(<FacilityBanner {...bannerData} />)
    const aEl = container.querySelectorAll('a')

    expect(screen.queryByText(/VAPHS COVID-19 Vaccines/)).toBeInTheDocument()
    expect(
      screen.queryByText(/For the latest coronavirus information/)
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
    bannerData.path = '/wilkes-barre-health-care'
    const { container } = render(<FacilityBanner {...bannerData} />)
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
    bannerData.bannerAlertVacms = null
    const { container } = render(<FacilityBanner {...bannerData} />)
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
    bannerData.operatingStatus = null
    const { container } = render(<FacilityBanner {...bannerData} />)
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
    bannerData.inheritanceSubpages = false
    render(<FacilityBanner {...bannerData} />)

    expect(screen.queryByText(/COVID-19 vaccines:/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Find other VA facilities near you/)
    ).not.toBeInTheDocument()
  })
})

describe('<FacilityBanner> component does not render', () => {
  test('without node data', () => {
    render(<FacilityBanner {...bannerData} />)
    expect(screen.queryByText(/COVID-19 vaccines:/)).not.toBeInTheDocument()
  })

  test('when hideOnSubpages = true', () => {
    bannerData.inheritanceSubpages = true
    bannerData.path = '/lastArg'
    render(<FacilityBanner {...bannerData} />)

    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute('visible', 'true')
  })
})
