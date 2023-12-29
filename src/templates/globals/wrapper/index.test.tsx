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
const props = { bannerData: [], headerFooterData: {} }

describe('<Wrapper> renders', () => {
  test('body', () => {
    render(
      <>
        <Wrapper {...props}>
          <div>This is the layout</div>
        </Wrapper>
      </>
    )

    expect(document.querySelector('body')).toBeInTheDocument()
  })

  test('<Banner> when bannerData exists', () => {
    render(
      <Wrapper {...props} bannerData={banners}>
        {children}
      </Wrapper>
    )
    expect(screen.getByRole('region')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
  })

  test('<Banner> when bannerData does not exist', () => {
    render(<Wrapper {...props}>{children}</Wrapper>)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()
  })

  test('Header and Footer are present', () => {
    render(
      <Wrapper {...props} bannerData={banners}>
        {children}
      </Wrapper>
    )

    expect(screen.getByRole('banner')).toHaveClass('header')

    const footer = screen.getByTestId('footer')
    // not sure why, there is only one contentinfo role present
    expect(screen.getAllByRole('contentinfo')[0]).toContainElement(footer)
  })
})
