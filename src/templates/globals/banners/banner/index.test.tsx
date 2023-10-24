import { render, screen } from 'test-utils'
import { Banner } from '@/templates/globals/banners/banner'

const mockBannerData = {
  id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
  title: 'COVID-19 vaccines at VA',
  path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
  body: 'The banner component is part of the VSP Design System Storybook located <a href=https://design.va.gov/storybook/?path=/docs/components-va-banner--default>here</a>',
  alertType: 'information',
  dismiss: true,
}

describe('<Banner> component renders', () => {
  test('with valid data', () => {
    render(<Banner {...mockBannerData} />)
    expect(
      screen.queryByText(
        /The banner component is part of the VSP Design System Storybook/
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('region')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
  })
})

describe('<Banner> component does not render', () => {
  test('without node data', () => {
    mockBannerData.body = null
    render(<Banner {...mockBannerData} />)
    expect(
      screen.queryByText(
        /The banner component is part of the VSP Design System Storybook/
      )
    ).not.toBeInTheDocument()
  })
})
