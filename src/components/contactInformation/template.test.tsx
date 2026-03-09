import { render, screen } from '@testing-library/react'
jest.mock('@/lib/analytics/recordEvent')
import { ContactInformation } from './template'
import { ContactInformation as FormattedContactInformation } from '@/components/contactInformation/formatted-type'

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

  test('renders default without gray background', () => {
    const { container } = render(<ContactInformation {...data} />)

    expect(screen.getByText('Need more help?')).toBeInTheDocument()
    expect(screen.getByText(/Call/)).toBeInTheDocument()
    expect(
      container.querySelector('.vads-u-background-color--gray-light-alt')
    ).not.toBeInTheDocument()
  })

  test('renders with grayWide when specified', () => {
    const { container } = render(<ContactInformation {...data} grayWide />)

    expect(
      container.querySelector('.vads-u-background-color--gray-light-alt')
    ).toBeInTheDocument()
    expect(screen.getByText('Need more help?')).toBeInTheDocument()
  })

  test('renders additional contact when provided', () => {
    const withAdditional: FormattedContactInformation = {
      ...data,
      additionalContact: {
        id: '11',
        type: 'paragraph--email_contact',
        address: 'test@va.gov',
        label: 'Minority Veterans Program',
      },
    }

    const { container } = render(<ContactInformation {...withAdditional} />)

    expect(screen.getByText(/Minority Veterans Program/)).toBeInTheDocument()
    const vaLink = container.querySelector('va-link[href="mailto:test@va.gov"]')
    expect(vaLink).toBeInTheDocument()
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
})
