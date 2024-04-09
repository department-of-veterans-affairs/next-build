import { render, screen } from '@testing-library/react'
import { Banner } from './'

// Reset mockBannerData for each test to prevent test interference
const getMockBannerData = () => ({
  id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
  title: 'COVID-19 vaccines at VA',
  body: 'The banner component is part of the VSP Design System Storybook located <a href="https://design.va.gov/storybook/?path=/docs/components-va-banner--default">here</a>',
  alertType: 'information',
  dismiss: true,
})

describe('<Banner> component renders', () => {
  test('with valid data', () => {
    const mockBannerData = getMockBannerData()
    render(<Banner {...mockBannerData} />)
    expect(
      screen.getByText(
        /The banner component is part of the VSP Design System Storybook/
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('region')).toHaveAttribute(
      'headline',
      mockBannerData.title
    )
  })

  test('with dismiss permanently', () => {
    const mockBannerData = getMockBannerData()
    render(<Banner {...mockBannerData} dismiss={true} />)
    expect(
      screen.getByText(
        /The banner component is part of the VSP Design System Storybook/
      )
    ).toBeInTheDocument()
  })

  test('with dismiss as false', () => {
    const mockBannerData = getMockBannerData()
    mockBannerData.dismiss = false
    render(<Banner {...mockBannerData} />)

    expect(
      screen.getByText(
        /The banner component is part of the VSP Design System Storybook/
      )
    ).toBeInTheDocument()
  })
})

describe('<Banner> component does not render', () => {
  test('without body content', () => {
    const mockBannerData = getMockBannerData()
    mockBannerData.body = ''
    render(<Banner {...mockBannerData} />)

    expect(screen.queryByRole('region')).toBeInTheDocument() // The region will render but should be empty
    expect(
      screen.queryByText(
        /The banner component is part of the VSP Design System Storybook/
      )
    ).not.toBeInTheDocument()
  })
})
