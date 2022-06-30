import { render, screen } from 'test-utils'
import mockNode from './mock.json'
import { PersonProfile } from '@/components/node/person_profile/index'
import { NodePersonProfile } from '@/types/node'

const nodePersonProfile: NodePersonProfile = mockNode

describe('PersonProfile with valid data', () => {
  test('renders PersonProfile component', () => {
    const { container } = render(<PersonProfile node={nodePersonProfile} />)
    const imageMeta = screen.getByRole('img')
    const aEl = container.querySelectorAll('a')

    expect(aEl).toHaveLength(4)

    //Thumbnail
    expect(imageMeta).toBeVisible()
    expect(imageMeta).toHaveAttribute(
      'alt',
      'Michael Buchanan outreach and community engagement specialist '
    )
    expect(imageMeta).toHaveAttribute('title', 'Michael Buchanan')

    //Bio
    expect(screen.queryByText(/Mr/)).toBeInTheDocument()
    expect(screen.queryByText(/Michael Buchanan/)).toBeInTheDocument()

    expect(
      screen.queryByText(
        /Outreach and community engagement specialist, host of Charlie Mike VA podcast/
      )
    ).toBeInTheDocument()
    expect(screen.queryByText(/michael.buchannan@va.gov/)).toBeInTheDocument()
    expect(aEl[0]).toHaveAttribute('href', 'mailto:michael.buchannan@va.gov')
    expect(screen.queryByText(/412-551-9651/)).toBeInTheDocument()
    expect(aEl[1]).toHaveAttribute('href', 'tel:412-551-9651')

    expect(screen.queryByText(/Intro text/)).toBeInTheDocument()
    expect(screen.queryByText(/The body is here/)).toBeInTheDocument()
    expect(screen.queryByText(/Download full size photo/)).toBeInTheDocument()

    expect(screen.queryByText(/Download full bio/)).toBeInTheDocument()
    expect(aEl[3]).toHaveAttribute('href', 'https://bio.com')
  })
})

describe('PersonProfile with invalid data', () => {
  test('does not render Thumbnail when field_media is null', () => {
    nodePersonProfile.field_media = null
    const { container } = render(<PersonProfile node={nodePersonProfile} />)
    const imageEl = container.querySelectorAll('img')

    expect(imageEl).toHaveLength(0)
  })

  test('does not render description when field_description is null or empty', () => {
    nodePersonProfile.field_description = null
    render(<PersonProfile node={nodePersonProfile} />)

    expect(
      screen.queryByText(
        /4Outreach and community engagement specialist, host of Charlie Mike VA podcast/
      )
    ).not.toBeInTheDocument()

    nodePersonProfile.field_description = ''
    render(<PersonProfile node={nodePersonProfile} />)

    expect(
      screen.queryByText(
        /Outreach and community engagement specialist, host of Charlie Mike VA podcast/
      )
    ).not.toBeInTheDocument()
  })

  test('does not render field_email_address when null or empty', () => {
    nodePersonProfile.field_email_address = null
    render(<PersonProfile node={nodePersonProfile} />)

    expect(
      screen.queryByText(/michael.buchannan@va.gov/)
    ).not.toBeInTheDocument()

    nodePersonProfile.field_email_address = ''
    render(<PersonProfile node={nodePersonProfile} />)

    expect(
      screen.queryByText(/michael.buchannan@va.gov/)
    ).not.toBeInTheDocument()
  })

  test('does not render field_phone_number when null or empty', () => {
    nodePersonProfile.field_phone_number = null
    render(<PersonProfile node={nodePersonProfile} />)

    expect(screen.queryByText(/412-551-9651/)).not.toBeInTheDocument()

    nodePersonProfile.field_phone_number = ''
    render(<PersonProfile node={nodePersonProfile} />)

    expect(screen.queryByText(/412-551-9651/)).not.toBeInTheDocument()
  })

  test('does not render body when field_complete_biography_create is false', () => {
    nodePersonProfile.field_complete_biography_create = false
    render(<PersonProfile node={nodePersonProfile} />)

    expect(screen.queryByText(/Intro text/)).not.toBeInTheDocument()
    expect(screen.queryByText(/The body is here/)).not.toBeInTheDocument()
  })

  test('does not render photo download option when field_photo_allow_hires_download is false', () => {
    nodePersonProfile.field_photo_allow_hires_download = false
    render(<PersonProfile node={nodePersonProfile} />)

    expect(
      screen.queryByText(/Download full size photo/)
    ).not.toBeInTheDocument()
  })

  test('does not render bio download option when field_complete_biography is null', () => {
    nodePersonProfile.field_complete_biography = null
    render(<PersonProfile node={nodePersonProfile} />)

    expect(screen.queryByText(/Download full bio/)).not.toBeInTheDocument()
  })
})
