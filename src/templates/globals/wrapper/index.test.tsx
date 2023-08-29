import { render, screen } from 'test-utils'
import '@testing-library/jest-dom'
import { Wrapper } from './index'

const children = <div></div>
const banners = [
  {
    id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
    title: 'COVID-19 vaccines at VA',
    path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
    body: 'This is the banner body',
    alertType: 'information',
    dismiss: true,
    type: 'node--banner',
  },
]

describe('<Wrapper> renders', () => {
  test('body', () => {
    render(
      <>
        <Wrapper>
          <div>This is the layout</div>
        </Wrapper>
      </>
    )

    expect(document.querySelector('body')).toBeInTheDocument()
  })

  test('<Banner> when bannerData exists', () => {
    const props = { bannerData: banners }

    render(<Wrapper bannerData={props.bannerData}>{children}</Wrapper>)
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
  })

  test('<Banner> when bannerData does not exist', () => {
    const props = { bannerData: null }

    render(<Wrapper bannerData={props.bannerData}>{children}</Wrapper>)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()
  })
})
