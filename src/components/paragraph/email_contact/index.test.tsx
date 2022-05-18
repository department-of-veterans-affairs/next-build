import { render, screen } from '@testing-library/react'
import EmailContact from './index'
import { fireEvent, getByRole } from '@testing-library/dom'
import * as recordEvent from '@/utils/recordEvent'

const paragraph = {
  type: 'paragraph--email_contact',
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  created: '2020-10-16T20:09:53+00:00',
  parent_id: '8475',
  parent_type: 'node',
  field_email_address: 'test.veteran@va.gov',
  field_email_label: 'Minority Veterans Program',
}

describe('Email with valid data', () => {
  test('renders EmailContact component', () => {
    render(<EmailContact paragraph={paragraph} />)

    expect(screen.queryByText(/Minority Veterans Program/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'mailto:test.veteran@va.gov'
    )
  })

  test('click event sends correct params to recordEvent', () => {
    paragraph.field_email_address = 't$st.vet=ran@va.gov'
    const { container } = render(<EmailContact paragraph={paragraph} />)
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
    paragraph.field_email_label = null
    paragraph.field_email_address = null

    render(<EmailContact paragraph={paragraph} />)

    expect(
      screen.queryByText(/Minority Veterans Program/)
    ).not.toBeInTheDocument()
  })

  test('does not render EmailContact component when label is not present', () => {
    paragraph.field_email_label = null
    paragraph.field_email_address = 'test.veteran@va.gov'
    render(<EmailContact paragraph={paragraph} />)

    expect(
      screen.queryByText(/Minority Veterans Program/)
    ).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  test('does not render EmailContact component when email address is not present', () => {
    paragraph.field_email_label = 'Test'
    paragraph.field_email_address = null
    console.log('paragraph ', paragraph)
    render(<EmailContact paragraph={paragraph} />)

    expect(
      screen.queryByText(/Minority Veterans Program/)
    ).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})
