import { render, screen } from 'test-utils'
import '@testing-library/jest-dom'
import Layout from './index'
import mock_banner from '@/templates/globals/banner/nodeBanner.json'

const children = <div></div>
const footerData = {
  column: 1,
  href: 'https://www.va.gov/homeless/',
  order: 1,
  target: '',
  title: 'Homeless Veterans',
}
const banner = {
  id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
  title: 'COVID-19 vaccines at VA',
  path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
  body: 'This is the banner body',
  alertType: 'information',
  dismiss: true,
}

describe('<Layout> renders', () => {
  test.skip('body', () => {
    render(
      <>
        <Layout>
          <div>This is the layout</div>
        </Layout>
      </>
    )

    expect(document.querySelector('body')).toBeInTheDocument()
  })

  test.skip('Footer data', () => {
    render(<Layout>{children}</Layout>)
    expect(screen.queryByText(/Get answers/i)).not.toBeInTheDocument()
  })

  test.skip('<Banner> when bannerData and footerData exist', () => {
    const props = { bannerData: [banner], footerData: [footerData] }

    render(<Layout props={props}>{children}</Layout>)
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
  })
})

describe('<Layout> does not render', () => {
  test.skip('<Banner> when bannerData does not exist', () => {
    const props = { bannerData: null, footerData: [footerData] }

    render(<Layout props={props}>{children}</Layout>)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Veteran programs and services/)
    ).toBeInTheDocument()
  })

  test.skip('<Footer> when footerData exists', () => {
    const props = { bannerData: [], footerData: [footerData] }

    render(<Layout props={props}>{children}</Layout>)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(/Veteran programs and services/)
    ).toBeInTheDocument()
  })

  test.skip('<Footer> when footerData does not exist', () => {
    const props = { bannerData: [mock_banner], footerData: [] }

    render(<Layout props={props}>{children}</Layout>)
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Veteran programs and services/)
    ).not.toBeInTheDocument()
  })
})
