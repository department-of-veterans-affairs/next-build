import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { ConnectWithUsPanel } from './ConnectWithUsPanel'

// Import the loader to register web components
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
const mockConnectWithUsProps = {
  field_email_updates_link: {
    title: 'Subscribe to email updates',
    url: 'https://www.va.gov/subscribe',
    options: [],
    uri: '',
  },
  field_social_media_links: {
    platform: null,
    value: null,
    platform_values: {
      facebook: {
        value: 'VeteransAffairs',
      },
      instagram: {
        value: 'VeteransAffairs',
      },
      twitter: {
        value: 'VAVetBenefits',
      },
      linkedin: {
        value: 'department-of-veterans-affairs',
      },
      youtube: {
        value: 'VeteransAffairs',
      },
    },
  },
}

describe('ConnectWithUsPanel with valid data', () => {
  beforeAll(() => {
    defineCustomElements()
  })
  test('render ConnectWithUsPanel component', async () => {
    const { container } = render(
      <ConnectWithUsPanel connectWithUs={mockConnectWithUsProps} />
    )
    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
  test('should render h3 tags for section titles', () => {
    render(<ConnectWithUsPanel connectWithUs={mockConnectWithUsProps} />)
    expect(document.querySelectorAll('h3')).toHaveLength(2)
  })
  test('should render email updates link', () => {
    render(<ConnectWithUsPanel connectWithUs={mockConnectWithUsProps} />)
    const emailLink = document.querySelector('va-link')
    expect(emailLink).toBeInTheDocument()
    expect(emailLink.href).toBe('https://www.va.gov/subscribe')
    expect(emailLink.text).toBe('Subscribe to email updates')
  })

  test('should render social media links', () => {
    render(<ConnectWithUsPanel connectWithUs={mockConnectWithUsProps} />)
    const twitterLink = document.querySelectorAll('va-link')[1]
    const facebookLink = document.querySelectorAll('va-link')[2]
    const youtubeLink = document.querySelectorAll('va-link')[3]

    expect(twitterLink.href).toBe('https://twitter.com/VAVetBenefits')
    expect(twitterLink.text).toBe('Veterans Affairs X (formerly Twitter)')

    expect(facebookLink.href).toBe('https://facebook.com/VeteransAffairs')
    expect(facebookLink.text).toBe('Veterans Affairs Facebook')

    expect(youtubeLink.href).toBe('https://youtube.com/VeteransAffairs')
    expect(youtubeLink.text).toBe('Veterans Affairs YouTube')
  })
})
