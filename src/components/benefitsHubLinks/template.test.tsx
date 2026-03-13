import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { axe } from '@/test-utils'
import { BenefitsHubLinks } from './template'

jest.mock('@/lib/analytics/recordEvent')
import { recordEvent } from '@/lib/analytics/recordEvent'

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
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders BenefitsHubLinks component', async () => {
    const { container } = render(<BenefitsHubLinks {...data} />)

    expect(screen.queryByText(/Health Care/)).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders introText when provided', () => {
    const introText = 'Here are some helpful resources for you.'
    render(<BenefitsHubLinks {...data} introText={introText} />)

    expect(screen.getByText(introText)).toBeInTheDocument()
  })

  test('does not render intro paragraph when introText is not provided', () => {
    const { container } = render(<BenefitsHubLinks {...data} />)

    const section = container.querySelector('section')
    const h2 = section?.querySelector('h2')
    expect(h2?.nextElementSibling?.tagName).toBe('UL')
  })

  test('calls recordEvent with correct parameters when link is clicked', () => {
    render(<BenefitsHubLinks {...data} />)

    const healthCareLink = screen.getByRole('link', { name: 'Health Care' })
    fireEvent.click(healthCareLink)

    expect(recordEvent).toHaveBeenCalledWith({
      event: 'nav-linkslist',
      'links-list-header': 'Health Care',
      'links-list-section-header': data.title,
    })
  })
})
