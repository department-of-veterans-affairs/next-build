import { screen, render } from 'test-utils'
import '@testing-library/jest-dom'
import Layout from './index'
import mock_banner from '../node/banner/nodeBanner.json'

const children = <div></div>
const footerData = {column:1,href:"https://www.va.gov/homeless/",order:1,target:"",title:"Homeless Veterans"}

describe('<Layout> renders', () => {
  test('body', () => {
    render(
      <>
        <Layout>
          <div>This is the layout</div>
        </Layout>
      </>
    )

    expect(document.querySelector('body')).toBeInTheDocument()
  })

  test('Footer data', () => {
    render(<Layout>{children}</Layout>)
    expect(screen.queryByText(/Get answers/i)).not.toBeInTheDocument()
  })

  test('<Banner> when bannerData and footerData exist', () => {
<<<<<<< HEAD
    const props = { bannerData: [mock_banner], footerData: [footerData] }
=======
    const props = {bannerData:[mock_banner], footerData: [footerData]}
>>>>>>> 4ec9b2d (VACMS-9911 Update the layout unit tests to get to 100% coverage)

    render(<Layout props={props}>{children}</Layout>)
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
  })
})

describe('<Layout> does not render', () => {
  test('<Banner> when bannerData does not exist', () => {
<<<<<<< HEAD
    const props = { bannerData: null, footerData: [footerData] }

    render(<Layout props={props}>{children}</Layout>)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Veteran programs and services/)
    ).toBeInTheDocument()
  })

  test('<Footer> when footerData does not exist', () => {
    const props = { bannerData: [mock_banner], footerData: [] }

    render(<Layout props={props}>{children}</Layout>)
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Veteran programs and services/)
    ).not.toBeInTheDocument()
=======
    const props = {bannerData:[], footerData: [footerData]}

    render(<Layout props={props}>{children}</Layout>)
    expect(screen.queryByText(/This is the banner body/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Veteran programs and services/)).toBeInTheDocument()
  })

  test('<Footer> when footerData does not exist', () => {
    const props = {bannerData:[mock_banner], footerData: []}

    render(<Layout props={props}>{children}</Layout>)
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
    expect(screen.queryByText(/Veteran programs and services/)).not.toBeInTheDocument()
    screen.debug()
>>>>>>> 4ec9b2d (VACMS-9911 Update the layout unit tests to get to 100% coverage)
  })
})
