import { render, screen, fireEvent } from '@testing-library/react'
import { FacilityBanner } from '@/templates/common/banners/facilityBanner'
import '@testing-library/jest-dom'
import { recordEvent } from '@/lib/analytics/recordEvent'

jest.mock('@/lib/analytics/recordEvent')

describe('<FacilityBanner> component renders', () => {
  const bannerData = {
    id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
    title: 'Help Limit the Spread of COVID-19 and other Illnesses',
    body: '<p><strong>IMPORTANT UPDATES FROM VA PITTSBURGH</strong></p>\n\n<p>In-person visitation for COVID-negative inpatients at University Drive is limited to two visitors per patient during specified hours. Outpatients can bring a support person to clinic appointments and procedures. We require all entrants to wear a VA-provided procedure mask. For more information, please see <a href="/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other" title="VA Pittsburgh Health Care">VA Pittsburgh Health Care</a>.</p>\n\n<p>Please contact your local VA medical center if you have questions or concerns.</p>',
    fieldAlertType: 'information',
    dismiss: true,
    operatingStatus: true,
    inheritanceSubpages: null,
    path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
    bannerAlertVamcs: null,
    type: 'node--full_width_banner_alert',
  }

  const bannerDataWithFacilitiesLink = {
    ...bannerData,
    findFacilities: 'true',
  }

  test('with valid data', () => {
    const { container } = render(<FacilityBanner {...bannerData} />)
    const aEl = container.querySelectorAll('a')
    expect(
      screen.queryByText(/IMPORTANT UPDATES FROM VA PITTSBURGH/)
    ).toBeInTheDocument()
    expect(screen.getByTestId('facility-banner')).toHaveAttribute('id', bannerData.id)
    expect(aEl[0]).toHaveAttribute('href', bannerData.path)
    expect(aEl[0]).toHaveAttribute('title', 'VA Pittsburgh Health Care')
  })

  test('click event triggers recordEvent analytics function', () => {
    render(<FacilityBanner {...bannerDataWithFacilitiesLink} />)
    const link = screen.getByText('Find other VA facilities near you')
    fireEvent.click(link)
    expect(recordEvent).toHaveBeenCalled()
  })
  test('renders additional content when operatingStatus is true', () => {
    render(
      <FacilityBanner
        {...bannerDataWithFacilitiesLink}
        operatingStatus={true}
      />
    )
    expect(
      screen.getByText('Find other VA facilities near you')
    ).toBeInTheDocument()
  })

  test('does not render operating status link when statusUrl is not provided', () => {
    render(<FacilityBanner {...bannerData} operatingStatus={true} />)
    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).not.toBeInTheDocument()
  })

  test('does not render the find facilities link when findFacilities is false', () => {
    render(<FacilityBanner {...bannerData} findFacilities={null} />)
    expect(
      screen.queryByText('Find other VA facilities near you')
    ).not.toBeInTheDocument()
  })
})
