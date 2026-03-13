import { render, screen } from '@testing-library/react'
jest.mock('@/lib/analytics/recordEvent')
import { ContactInformation, EmailContact, PhoneContact } from './template'
import { ContactInformation as FormattedContactInformation } from '@/components/contactInformation/formatted-type'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

describe('EmailContact', () => {
  test('renders label and mailto link', () => {
    const { container } = render(
      <EmailContact label="Support" address="support@va.gov" />
    )
    expect(screen.getByText(/Support/)).toBeInTheDocument()
    const link = container.querySelector(
      'va-link[href="mailto:support@va.gov"]'
    )
    expect(link).toBeInTheDocument()
  })

  test('returns null when label is missing', () => {
    const { container } = render(<EmailContact label="" address="a@b.com" />)
    expect(container.firstChild).toBeNull()
  })

  test('returns null when address is missing', () => {
    const { container } = render(<EmailContact label="Email" address="" />)
    expect(container.firstChild).toBeNull()
  })
})

describe('PhoneContact', () => {
  test('renders with va-telephone for valid number', () => {
    const { container } = render(
      <PhoneContact label="Help line" number="855-867-5309" />
    )
    expect(screen.getByText(/Help line/)).toBeInTheDocument()
    expect(container.innerHTML).toContain('<va-telephone contact="8558675309">')
  })

  test('uses "Phone" as default label when not provided', () => {
    render(<PhoneContact number="800-555-1234" />)
    expect(screen.getByText(/Phone/)).toBeInTheDocument()
  })

  test('renders extension when provided', () => {
    const { container } = render(
      <PhoneContact label="Main" number="800-555-1234" extension="123" />
    )
    expect(container.innerHTML).toContain('extension="123"')
  })

  test('uses va-link for number with letters', () => {
    const { container } = render(
      <PhoneContact label="TTY" number="1-800-555-TTY" />
    )
    const link = container.querySelector('va-link[href="tel:1-800-555-TTY"]')
    expect(link).toBeInTheDocument()
    expect(container.querySelector('va-telephone')).not.toBeInTheDocument()
  })

  test('returns null when number is empty', () => {
    const { container } = render(<PhoneContact number="" />)
    expect(container.firstChild).toBeNull()
  })
})

describe('ContactInformation', () => {
  const data: FormattedContactInformation = {
    id: '1',
    type: 'paragraph--contact_information',
    contactType: 'DC',
    defaultContact: {
      label: 'MyVA411 main information line',
      number: '(855) 867-5309',
      href: 'tel:8558675309',
    },
  }

  const additionalContact = {
    id: '11',
    type: 'paragraph--email_contact',
    address: 'test@va.gov',
    label: 'Minority Veterans Program',
  } as const

  test('renders default contact', () => {
    const { container } = render(<ContactInformation {...data} />)

    const vaNeedHelp = container.querySelector('va-need-help')
    expect(vaNeedHelp).toBeInTheDocument()
    expect(vaNeedHelp?.querySelector('[slot="content"]')).toBeInTheDocument()
    expect(screen.getByText(/Call/)).toBeInTheDocument()
    expect(
      screen.getByText(/MyVA411 main information line/)
    ).toBeInTheDocument()
    expect(
      container.querySelector('va-link[href="mailto:"]')
    ).not.toBeInTheDocument()
  })

  test('renders additional contact when provided', () => {
    const withAdditional: FormattedContactInformation = {
      ...data,
      additionalContact,
    }

    const { container } = render(<ContactInformation {...withAdditional} />)

    expect(screen.getByText(/Minority Veterans Program/)).toBeInTheDocument()
    const vaLink = container.querySelector('va-link[href="mailto:test@va.gov"]')
    expect(vaLink).toBeInTheDocument()
  })

  test('does not render additional contact when it has no content', () => {
    const withEmptyAdditional: FormattedContactInformation = {
      ...data,
      additionalContact: {
        id: '11',
        type: 'paragraph--email_contact',
        address: '',
        label: 'Empty',
      },
    }

    const { container } = render(
      <ContactInformation {...withEmptyAdditional} />
    )

    expect(
      screen.getByText(/MyVA411 main information line/)
    ).toBeInTheDocument()
    expect(
      container.querySelector('va-link[href="mailto:test@va.gov"]')
    ).not.toBeInTheDocument()
  })

  it('does not render additional contact when there is no default contact', () => {
    const withNoDefault: FormattedContactInformation = {
      ...data,
      defaultContact: undefined,
    }

    const { container } = render(<ContactInformation {...withNoDefault} />)
    expect(
      container.querySelector('va-link[href="mailto:test@va.gov"]')
    ).not.toBeInTheDocument()
  })

  test('renders Benefit Hub Contacts when provided', () => {
    const bhc: FormattedContactInformation = {
      ...data,
      contactType: 'BHC',
      defaultContact: undefined,
      benefitHubContacts: [
        {
          label: 'My HealtheVet help desk: ',
          number: '877-327-0022',
          href: 'tel:8773270022',
        },
      ],
    }

    const { container } = render(<ContactInformation {...bhc} />)

    expect(screen.getByText(/My HealtheVet help desk/)).toBeInTheDocument()
    expect(container.innerHTML).toContain('<va-telephone contact="8773270022">')
  })

  test('renders multiple Benefit Hub contacts', () => {
    const bhc: FormattedContactInformation = {
      ...data,
      contactType: 'BHC',
      defaultContact: undefined,
      benefitHubContacts: [
        {
          label: 'First contact:',
          number: '800-111-1111',
          href: 'tel:8001111111',
        },
        {
          label: 'Second contact:',
          number: '800-222-2222',
          href: 'tel:8002222222',
        },
      ],
    }

    const { container } = render(<ContactInformation {...bhc} />)

    expect(screen.getByText(/First contact/)).toBeInTheDocument()
    expect(screen.getByText(/Second contact/)).toBeInTheDocument()
    expect(container.innerHTML).toContain('<va-telephone contact="8001111111">')
    expect(container.innerHTML).toContain('<va-telephone contact="8002222222">')
  })

  test('renders additional contact as phone when provided', () => {
    const withPhoneAdditional: FormattedContactInformation = {
      ...data,
      additionalContact: {
        id: '22',
        type: PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT,
        label: 'Veterans Crisis Line',
        number: '988',
        extension: '',
      },
    }

    const { container } = render(
      <ContactInformation {...withPhoneAdditional} />
    )

    expect(screen.getByText(/Veterans Crisis Line/)).toBeInTheDocument()
    expect(container.innerHTML).toContain('<va-telephone contact="988">')
  })

  test('renders default contact with va-link when number has letters', () => {
    const withLetters: FormattedContactInformation = {
      ...data,
      defaultContact: {
        label: 'TTY line',
        number: '1-800-555-TTY',
        href: 'tel:1800555TTY',
      },
    }

    const { container } = render(<ContactInformation {...withLetters} />)

    expect(screen.getByText(/TTY line/)).toBeInTheDocument()
    const link = container.querySelector('va-link[href="tel:1800555TTY"]')
    expect(link).toBeInTheDocument()
    // Main number uses va-link (not va-telephone) when it contains letters
    expect(
      container.querySelector('va-telephone[contact="1800555"]')
    ).not.toBeInTheDocument()
  })

  test('renders TTY 711 for hearing loss', () => {
    const { container } = render(<ContactInformation {...data} />)
    expect(container.innerHTML).toContain('contact="711"')
    expect(container.innerHTML).toContain('tty="true"')
  })

  test('renders data-template attribute on section', () => {
    const { container } = render(<ContactInformation {...data} />)
    const section = container.querySelector(
      '[data-template="paragraphs/contact_information"]'
    )
    expect(section).toBeInTheDocument()
  })

  test('wraps content in va-need-help with content slot', () => {
    const { container } = render(<ContactInformation {...data} />)
    const section = container.querySelector(
      '[data-template="paragraphs/contact_information"]'
    )
    const vaNeedHelp = section?.querySelector('va-need-help')
    expect(vaNeedHelp).toBeInTheDocument()
    const contentSlot = vaNeedHelp?.querySelector('[slot="content"]')
    expect(contentSlot).toBeInTheDocument()
    expect(contentSlot?.textContent).toContain('MyVA411 main information line')
  })
})
