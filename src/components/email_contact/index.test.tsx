import { render, screen } from '@testing-library/react'
import { fireEvent, getByRole } from '@testing-library/dom'
import * as recordEvent from '@/utils/recordEvent'
import { EmailContact, EmailContactProps } from '@/components/email_contact'

const emailContact: EmailContactProps = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  address: 'test.veteran@va.gov',
  label: 'Minority Veterans Program',
}

describe('Email with valid data', () => {
  test('renders EmailContact component', () => {
    render(<EmailContact key={emailContact.id} {...emailContact} />)

    expect(screen.queryByText(/Minority Veterans Program/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'mailto:test.veteran@va.gov'
    )
  })

  test('click event sends correct params to recordEvent', () => {
    emailContact.address = 't$st.vet=ran@va.gov'
    const { container } = render(
      <EmailContact key={emailContact.id} {...emailContact} />
    )
    const spyRecordEvent = jest.spyOn(recordEvent, 'recordEvent')
    const link = getByRole(container, 'link')

    fireEvent.click(link)
    expect(spyRecordEvent).toHaveBeenCalledWith({
      event: 'nav-linkslist',
      'links-list-header': 't%24st.vet%3Dran%40va.gov',
      'links-list-section-header': 'Need more help?',
    })
  })
})

describe('EmailContact with invalid data', () => {
  test('does not render EmailContact component when label and email address are not present', () => {
    emailContact.label = null
    emailContact.address = null

    render(<EmailContact key={emailContact.id} {...emailContact} />)

    expect(
      screen.queryByText(/Minority Veterans Program/)
    ).not.toBeInTheDocument()
  })

  test('does not render EmailContact component when label is not present', () => {
    emailContact.label = null
    emailContact.address = 'test.veteran@va.gov'
    render(<EmailContact key={emailContact.id} {...emailContact} />)

    expect(
      screen.queryByText(/Minority Veterans Program/)
    ).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  test('does not render EmailContact component when email address is not present', () => {
    emailContact.label = 'Test'
    emailContact.address = null
    render(<EmailContact key={emailContact.id} {...emailContact} />)

    expect(
      screen.queryByText(/Minority Veterans Program/)
    ).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})
