import { render, screen } from '@testing-library/react'
import { BenefitsHubLinks } from './index'

describe('BenefitsHubLinks with valid data', () => {
  test('renders the correct number of links when there are multiple', () => {
    const links = [
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
    ]

    render(<BenefitsHubLinks links={links} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  test('renders link correctly when there is only one', () => {
    const link = [
      {
        id: '386eb70d-696c-4af3-8986-306ce63d90de',
        path: '/resources/helpful-va-phone-numbers',
        title: 'VA health care',
        label: 'Health Care',
        teaserText:
          'Apply for VA health care, find out how to access services, and manage your health and benefits online.',
      }
    ]

    render(<BenefitsHubLinks links={link} />)

    expect(screen.getAllByRole('paragraph')).toHaveLength(2)
  })
})
