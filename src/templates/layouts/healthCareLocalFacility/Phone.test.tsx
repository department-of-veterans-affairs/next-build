import { render, screen } from '@testing-library/react'
import { Phone } from './Phone'
import { formatter as formatPhone } from '@/data/queries/phoneNumber'

describe('Phone', () => {
  it('renders nothing when no props are provided', () => {
    const { container } = render(<Phone />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders main phone', () => {
    const { container } = render(<Phone mainPhoneString="123-456-7890 x123" />)
    expect(screen.getByText('Main phone:')).toBeInTheDocument()
    const tel = container.querySelector('va-telephone')
    expect(tel).toBeInTheDocument()
  })

  it('renders VA health connect phone', () => {
    render(<Phone vaHealthConnectPhoneNumber="123-456-7890" />)
    expect(screen.getByText('VA health connect:')).toBeInTheDocument()
  })

  it('renders fieldTelephone info', () => {
    const { container } = render(
      <Phone
        mentalHealthPhoneNumber={formatPhone({
          id: 'blech',
          type: 'paragraph--phone_number',
          drupal_internal__id: 1234,
          drupal_internal__revision_id: 1234,
          status: true,
          langcode: 'en',
          field_phone_label: null,
          field_phone_number: '123-456-7890',
          field_phone_number_type: 'fax',
          field_phone_extension: '321',
        })}
      />
    )

    expect(screen.getByText('Mental health care:')).toBeInTheDocument()
    const tel = container.querySelector('va-telephone')
    expect(tel).toHaveAttribute('not-clickable')
    expect(tel.getAttribute('contact')).toBe('1234567890')
    expect(tel.getAttribute('extension')).toBe('321')
  })

  it('renders all phone numbers', () => {
    const { container } = render(
      <Phone
        mainPhoneString="123-456-7890 x123"
        vaHealthConnectPhoneNumber="987-654-3210"
        mentalHealthPhoneNumber={formatPhone({
          id: 'blech',
          type: 'paragraph--phone_number',
          drupal_internal__id: 1234,
          drupal_internal__revision_id: 1234,
          status: true,
          langcode: 'en',
          field_phone_label: null,
          field_phone_number: '555-555-5555',
          field_phone_number_type: 'fax',
          field_phone_extension: '321',
        })}
      />
    )

    const vaTelephoneElements = container.querySelectorAll('va-telephone')
    expect(vaTelephoneElements).toHaveLength(3)

    expect(screen.getByText('Main phone:')).toBeInTheDocument()
    expect(screen.getByText('VA health connect:')).toBeInTheDocument()
    expect(screen.getByText('Mental health care:')).toBeInTheDocument()

    // Main phone
    expect(vaTelephoneElements[0].getAttribute('contact')).toBe('1234567890')
    expect(vaTelephoneElements[0].getAttribute('extension')).toBe('123')

    // VA Health connect
    expect(vaTelephoneElements[1].getAttribute('contact')).toBe('9876543210')

    // Field telephone number
    expect(vaTelephoneElements[2]).toHaveAttribute('not-clickable')
    expect(vaTelephoneElements[2].getAttribute('contact')).toBe('5555555555')
    expect(vaTelephoneElements[2].getAttribute('extension')).toBe('321')
  })
})
