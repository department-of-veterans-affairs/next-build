import { render, screen } from '@testing-library/react'
import { BenefitsHubLinks } from './index'

const data = {
  title: 'Deciding how much life insurance to get',
  links: [
    {
      id: '386eb70d-696c-4af3-8986-306ce63d90de',
      path: '/resources/helpful-va-phone-numbers',
      title: 'VA health care',
      label: 'Health Care',
      teaserText:
        'Apply for VA health care, find out how to access services, and manage your health and benefits online.',
    },
    {
      id: '286eb70d-696c-4af3-8986-306ce63d90de',
      path: '/resources/change-your-address-on-file-with-va',
      title: 'VA disability compensation',
      label: 'Education and training',
      teaserText:
        'Apply for and manage your GI Bill and other education benefits to help pay for college and training programs.',
    },
  ],
}

describe('BenefitsHubLinks with valid data', () => {
  test('renders BenefitsHubLinks component', () => {
    render(<BenefitsHubLinks {...data} />)

    expect(screen.queryByText(/Health Care/)).toBeInTheDocument()
  })
})
