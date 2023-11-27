import { render, screen } from 'test-utils'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import { FacilityBanner as FormattedFacilityBanner } from '@/types/dataTypes/formatted/banners'

const bannerData: FormattedFacilityBanner = {
  id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
  title: 'Help Limit the Spread of COVID-19 and other Illnesses',
  body: '<p><strong>IMPORTANT UPDATES FROM VA PITTSBURGH</strong></p>\n\n<p>In-person visitation for COVID-negative inpatients at University Drive is limited to two visitors per patient during specified hours. Outpatients can bring a support person to clinic appointments and procedures. We require all entrants to wear a VA-provided procedure mask. For more information, please see <a href="/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other" title="VA Pittsburgh Health Care">VA Pittsburgh Health Care</a>.</p>\n\n<p>Please contact your local VA medical center if you have questions or concerns.</p>',
  fieldAlertType: 'information',
  dismiss: true,
  operatingStatus: true,
  inheritanceSubpages: null,
  path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
  bannerAlertVamcs: [null],
  type: 'node--full_width_banner_alert',
}

describe('<FacilityBanner> component renders', () => {
  test('with valid data', () => {
    const { container } = render(<FacilityBanner {...bannerData} />)
    const aEl = container.querySelectorAll('a')
    expect(
      screen.queryByText(/IMPORTANT UPDATES FROM VA PITTSBURGH/)
    ).toBeInTheDocument()
    expect(screen.getByRole('region')).toHaveAttribute(
      'headline',
      'Help Limit the Spread of COVID-19 and other Illnesses'
    )
    expect(aEl[0]).toHaveAttribute(
      'href',
      '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other'
    )
    expect(aEl[0]).toHaveAttribute('title', 'VA Pittsburgh Health Care')
  })
})
