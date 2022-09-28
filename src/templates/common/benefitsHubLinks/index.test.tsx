import { render, screen } from '@testing-library/react'
import { BenefitsHubLinks } from './index'
import { BenefitsHubLinksType } from '@/types/index'

let benefitHubProps: BenefitsHubLinksType = {
  title: 'Deciding how much life insurance to get',
  relatedBenefitHubs: [
    {
      id: '386eb70d-696c-4af3-8986-306ce63d90de',
      url: '/resources/helpful-va-phone-numbers',
      title: 'VA health care',
      homePageHubLabel: 'Health Care',
      teaserText:
        'Apply for VA health care, find out how to access services, and manage your health and benefits online.',
    },
    {
      id: '286eb70d-696c-4af3-8986-306ce63d90de',
      url: '/resources/change-your-address-on-file-with-va',
      title: 'VA disability compensation',
      homePageHubLabel: 'Education and training',
      teaserText:
        'Apply for and manage your GI Bill and other education benefits to help pay for college and training programs.',
    },
  ],
}

describe('<BenefitsHubLinks> with valid data', () => {
  test('renders component', () => {
    const { container } = render(<BenefitsHubLinks {...benefitHubProps} />)

    const aEl = container.querySelectorAll('a')

    expect(aEl[0]).toHaveAttribute(
      'href',
      '/resources/helpful-va-phone-numbers'
    )
    expect(aEl[1]).toHaveAttribute(
      'href',
      '/resources/change-your-address-on-file-with-va'
    )

    expect(
      screen.queryByText(/Deciding how much life insurance to get/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Health Care/)).toBeInTheDocument()
  })
})

describe('<BenefitsHubLinks> with invalid data', () => {
  test('does not renders component', () => {
    benefitHubProps = null

    const { container } = render(<BenefitsHubLinks {...benefitHubProps} />)

    expect(
      screen.queryByText(/Deciding how much life insurance to get/)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/Health Care/)).not.toBeInTheDocument()
  })
})
