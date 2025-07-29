import { render } from '@testing-library/react'
import { ManageYourHealthLinks } from './ManageYourHealthLinks'

// Mock the environment variable
const originalEnv = process.env

/**
 * Helper function to query for va-link elements by their text content. Takes a container
 * and returns a function that can be used to query for a link by text content.
 */
const getVaLinkByTextFn = (container: HTMLElement) => (text: string) => {
  return container.querySelector(`va-link[text="${text}"]`)
}

describe('ManageYourHealthLinks', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders all health links with correct text', () => {
    const { container } = render(
      <ManageYourHealthLinks vamcEhrSystem="vista" />
    )

    const linkTexts = [
      'Refill and track your prescriptions',
      'Send a secure message to your health care team',
      'Schedule and manage health appointments',
      'Download VA Health Chat',
      'Download your VA medical records (Blue Button)',
      'View your lab and test results',
      'Order hearing aid batteries and accessories',
      'Connect to VA care',
    ]

    const getVaLinkByText = getVaLinkByTextFn(container)
    linkTexts.forEach((text) => {
      expect(getVaLinkByText(text)).toBeInTheDocument()
    })
  })

  it('renders all icons', () => {
    render(<ManageYourHealthLinks vamcEhrSystem="vista" />)

    const icons = document.querySelectorAll('va-icon')
    expect(icons).toHaveLength(9)
  })

  it('generates correct URLs for Vista system', () => {
    const { container } = render(
      <ManageYourHealthLinks vamcEhrSystem="vista" />
    )

    const getVaLinkByText = getVaLinkByTextFn(container)
    const refillLink = getVaLinkByText('Refill and track your prescriptions')
    const messagingLink = getVaLinkByText(
      'Send a secure message to your health care team'
    )
    const appointmentsLink = getVaLinkByText(
      'Schedule and manage health appointments'
    )

    expect(refillLink).toHaveAttribute(
      'href',
      '/health-care/refill-track-prescriptions/'
    )
    expect(messagingLink).toHaveAttribute(
      'href',
      '/health-care/secure-messaging/'
    )
    expect(appointmentsLink).toHaveAttribute(
      'href',
      '/health-care/schedule-view-va-appointments/'
    )
  })

  it('generates correct URLs for Cerner system in production', () => {
    process.env.APP_ENV = 'vagovprod'
    const { container } = render(
      <ManageYourHealthLinks vamcEhrSystem="cerner" />
    )

    const getVaLinkByText = getVaLinkByTextFn(container)
    const refillLink = getVaLinkByText('Refill and track your prescriptions')
    const messagingLink = getVaLinkByText(
      'Send a secure message to your health care team'
    )
    const appointmentsLink = getVaLinkByText(
      'Schedule and manage health appointments'
    )

    expect(refillLink).toHaveAttribute(
      'href',
      'https://patientportal.myhealth.va.gov/pages/medications/current'
    )
    expect(messagingLink).toHaveAttribute(
      'href',
      'https://patientportal.myhealth.va.gov/pages/messaging/inbox'
    )
    expect(appointmentsLink).toHaveAttribute(
      'href',
      'https://patientportal.myhealth.va.gov/pages/scheduling/upcoming'
    )
  })

  it('generates correct URLs for Cerner staged system in non-production', () => {
    process.env.APP_ENV = 'vagovdev'
    const { container } = render(
      <ManageYourHealthLinks vamcEhrSystem="cerner_staged" />
    )

    const getVaLinkByText = getVaLinkByTextFn(container)
    const refillLink = getVaLinkByText('Refill and track your prescriptions')
    const messagingLink = getVaLinkByText(
      'Send a secure message to your health care team'
    )
    const appointmentsLink = getVaLinkByText(
      'Schedule and manage health appointments'
    )

    expect(refillLink).toHaveAttribute(
      'href',
      'https://patientportal.myhealth.va.gov/pages/medications/current'
    )
    expect(messagingLink).toHaveAttribute(
      'href',
      'https://patientportal.myhealth.va.gov/pages/messaging/inbox'
    )
    expect(appointmentsLink).toHaveAttribute(
      'href',
      'https://patientportal.myhealth.va.gov/pages/scheduling/upcoming'
    )
  })

  it('generates default URLs for Cerner staged in production', () => {
    process.env.APP_ENV = 'vagovprod'
    const { container } = render(
      <ManageYourHealthLinks vamcEhrSystem="cerner_staged" />
    )

    const getVaLinkByText = getVaLinkByTextFn(container)
    const refillLink = getVaLinkByText('Refill and track your prescriptions')
    const messagingLink = getVaLinkByText(
      'Send a secure message to your health care team'
    )
    const appointmentsLink = getVaLinkByText(
      'Schedule and manage health appointments'
    )

    expect(refillLink).toHaveAttribute(
      'href',
      '/health-care/refill-track-prescriptions/'
    )
    expect(messagingLink).toHaveAttribute(
      'href',
      '/health-care/secure-messaging/'
    )
    expect(appointmentsLink).toHaveAttribute(
      'href',
      '/health-care/schedule-view-va-appointments/'
    )
  })
})
