import { render, screen } from 'test-utils'
import { Banner } from '@/components/banner'
import mock_banner from './nodeBanner.json'

describe('<Banner> component renders', () => {
  const banner = {
    id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
    title: 'COVID-19 vaccines at VA',
    path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
    body: 'This is the banner body',
    alertType: 'information',
    dismiss: true,
  }
  test('with valid data', () => {
    render(<Banner {...banner} />)
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
  })
})

describe('<Banner> component does not render', () => {
  const banner = {
    id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
    title: 'COVID-19 vaccines at VA',
    path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
    body: '',
    alertType: 'information',
    dismiss: true,
  }
  test('without node data', () => {
    render(<Banner {...banner} />)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()
  })
})
