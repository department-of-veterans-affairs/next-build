import { render, screen } from 'test-utils'
import { ParagraphStaffProfile } from '@/types/paragraph'
import { StaffProfiles } from '@/components/paragraph/staff_profile/index'
import mockParagraph from './mock.json'

const paragraph: ParagraphStaffProfile = mockParagraph

describe('StaffProfiles with valid data', () => {
  test('renders StaffProfiles component', () => {
    const { container } = render(<StaffProfiles paragraph={paragraph} />)
    const imageMeta = screen.getByRole('img')
    const aEl = container.querySelectorAll('a')

    expect(aEl).toHaveLength(3)

    //Thumbnail
    expect(imageMeta).toBeVisible()
    expect(imageMeta).toHaveAttribute('alt', 'William W Smathers Headshot')
    expect(imageMeta).toHaveAttribute('title', 'William W Smathers')

    //Bio
    expect(aEl[0]).toHaveAttribute('href', 'http:va.gov')
    expect(screen.queryByText(/Mr/)).toBeInTheDocument()
    expect(screen.queryByText(/William/)).toBeInTheDocument()
    expect(screen.queryByText(/Smathers/)).toBeInTheDocument()

    expect(
      screen.queryByText(/OEF Transition Patient Advocate/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/412-551-9651/)).toBeInTheDocument()
    expect(aEl[1]).toHaveAttribute('href', 'tel:412-551-9651')
    expect(screen.queryByText(/william.smathers@aol.com/)).toBeInTheDocument()
    expect(aEl[2]).toHaveAttribute('href', 'mailto:william.smathers@aol.com')
  })
})

describe('StaffProfiles with invalid data', () => {
  test('does not render Thumbnail when field_media is null', () => {
    paragraph.field_staff_profile.field_media = null
    const { container } = render(<StaffProfiles paragraph={paragraph} />)
    const imageEl = container.querySelectorAll('img')

    expect(imageEl).toHaveLength(0)
  })

  test('does not render href when field_complete_biography_create is false', () => {
    paragraph.field_staff_profile.field_complete_biography_create = false
    const { container } = render(<StaffProfiles paragraph={paragraph} />)
    const aEl = container.querySelectorAll('a')

    expect(aEl).toHaveLength(2)
  })

  test('does not render field_description when null', () => {
    paragraph.field_staff_profile.field_description = null
    render(<StaffProfiles paragraph={paragraph} />)

    expect(
      screen.queryByText(/OEF Transition Patient Advocate/)
    ).not.toBeInTheDocument()
  })

  test('does not render field_phone_number when null or empty', () => {
    paragraph.field_staff_profile.field_phone_number = null
    render(<StaffProfiles paragraph={paragraph} />)

    expect(screen.queryByText(/412-551-9651/)).not.toBeInTheDocument()

    paragraph.field_staff_profile.field_phone_number = ''
    render(<StaffProfiles paragraph={paragraph} />)

    expect(screen.queryByText(/412-551-9651/)).not.toBeInTheDocument()
  })

  test('does not render field_email_address when null or empty', () => {
    paragraph.field_staff_profile.field_email_address = null
    render(<StaffProfiles paragraph={paragraph} />)

    expect(
      screen.queryByText(/william.smathers@aol.com/)
    ).not.toBeInTheDocument()

    paragraph.field_staff_profile.field_email_address = ''
    render(<StaffProfiles paragraph={paragraph} />)

    expect(
      screen.queryByText(/william.smathers@aol.com/)
    ).not.toBeInTheDocument()
  })
})
