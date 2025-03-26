import { render, screen } from '@testing-library/react'
jest.mock('@/lib/analytics/recordEvent')
import { ContactInfo } from './index'
import { ParagraphComponent } from '@/types/formatted/paragraph'
import { ContactInfo as FormattedContactInfo } from '@/types/formatted/contactInfo'

describe('ContactInfo with valid data', () => {
  const data: ParagraphComponent<FormattedContactInfo> = {
    id: '1',
    contactType: 'DC',
    defaultContact: {
      label: 'Phone Number',
      number: '(855) 867-5309',
      href: 'tel:8558675309',
    },
  }

  test('renders ContactInfo component with a default contact', () => {
    render(<ContactInfo {...data} />)

    expect(screen.queryByText(/Phone Number/)).toBeInTheDocument()
  })

  test('renders ContactInfo component with an additional contact', () => {
    const additional: ParagraphComponent<FormattedContactInfo> = {
      ...data,
      additionalContact: {
        id: '11',
        type: 'paragraph--email_contact',
        address: 'test@va.gov',
        label: 'Minority Veterans Program',
      },
    }

    render(<ContactInfo {...additional} />)

    expect(screen.queryByText(/Minority Veterans Program/)).toBeInTheDocument()
  })

  test('renders Benefit Hub Contacts information when provided', () => {
    const bhc: ParagraphComponent<FormattedContactInfo> = {
      ...data,
      contactType: 'BHC',
      benefitHubContacts: [
        {
          label: 'Health benefits hotline: ',
          number: '877-222-VETS (8387)',
          href: 'tel:8772228387',
        },
        {
          label: 'My HealtheVet help desk: ',
          number: '877-327-0022',
          href: 'tel:8773270022',
        },
        {
          label: 'eBenefits technical support:',
          number: '800-983-0937',
          href: 'tel:8009830937',
        },
        {
          label: 'MyVA411 main information line:',
          number: '800-698-2411',
          href: 'tel:8006982411',
        },
        {
          label: 'Telecommunications Relay Services (using TTY)',
          number: 'TTY: 711',
          href: 'tel:1+711',
        },
      ],
    }

    const { container } = render(<ContactInfo {...bhc} />)

    expect(screen.queryByText(/Phone Number/)).not.toBeInTheDocument()
    expect(screen.queryByText(/My HealtheVet help desk/)).toBeInTheDocument()
    expect(container.innerHTML).toContain(
      '<va-telephone contact="800-983-0937">'
    )
  })
})
