import { render, screen } from '@testing-library/react'
import { fireEvent, getByRole } from '@testing-library/dom'
jest.mock('@/lib/analytics/recordEvent')
import * as recordEvent from '@/lib/analytics/recordEvent'
import { ContactInfo } from './index'

describe('ContactInfo with valid data', () => {
  const data = {
    contactType: 'DC',
    defaultContact: {
      title: 'Phone Number',
      value: '(855) 867-5309',
      href: 'tel:8558675309',
    },
  }

  test('renders ContactInfo component with a default contact', () => {
    render(<ContactInfo {...data} />)

    expect(screen.queryByText(/Phone Number/)).toBeInTheDocument()
  })

  test('renders ContactInfo component with an additional contact', () => {
    const additional = {
      ...data,
      additionalContact: {
        email: {
          address: 'test.veteran@va.gov',
          label: 'Minority Veterans Program',
        },
        phone: {
          label: 'Phone Number',
          number: '(281) 330-8004',
          extension: '444',
        },
      },
    }

    render(<ContactInfo {...additional} />)

    expect(screen.queryByText(/Minority Veterans Program/)).toBeInTheDocument()
  })

  test('renders Benefit Hub Contacts information when provided', () => {
    const bhc = {
      ...data,
      contactType: 'BHC',
      benefitHubContacts: [
        {
          title: 'Health benefits hotline: ',
          value: '877-222-VETS (8387)',
          href: 'tel:8772228387',
        },
        {
          title: 'My HealtheVet help desk: ',
          value: '877-327-0022',
          href: 'tel:8773270022',
        },
        {
          title: 'eBenefits technical support:',
          value: '800-983-0937',
          href: 'tel:8009830937',
        },
        {
          title: 'MyVA411 main information line:',
          value: '800-698-2411',
          href: 'tel:8006982411',
        },
        {
          title: 'Telecommunications Relay Services (using TTY)',
          value: 'TTY: 711',
          href: 'tel:1+711',
        },
      ],
    }

    render(<ContactInfo {...bhc} />)

    expect(screen.queryByText(/Phone Number/)).not.toBeInTheDocument()
    expect(screen.queryByText(/My HealtheVet help desk/)).toBeInTheDocument()
  })

  test('click event sends correct params to recordEvent', () => {
    data.defaultContact.value = 't$st.vet=ran@va.gov'
    const { container } = render(<ContactInfo {...data} />)
    const link = getByRole(container, 'link')

    fireEvent.click(link)
    expect(recordEvent.recordEvent).toHaveBeenCalledWith({
      event: 'nav-linkslist',
      'links-list-header': 't%24st.vet%3Dran%40va.gov',
      'links-list-section-header': 'Need more help?',
    })
    jest.restoreAllMocks()
  })
})
