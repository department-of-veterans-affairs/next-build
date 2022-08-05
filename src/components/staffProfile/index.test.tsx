import { render, screen } from 'test-utils'
import { StaffProfile } from '@/components/staffProfile/index'

const props = {
  id: '7783e76f-5aca-4d14-9f5e-fb00cc11e4da',
  name: 'Mr William Smathers',
  thumbnail: {
    url: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/2019-08/William_W_Smathers.jpg',
    alt: 'William W Smathers Headshot',
    title: 'William W Smathers',
    width: 110,
    height: 136,
    styles: {},
  },
  linkToBio: true,
  path: 'http:va.gov',
  description: 'OEF Transition Patient Advocate',
  phone: '412-551-9651',
  email: 'william.smathers@aol.com',
}

describe('StaffProfile with valid data', () => {
  test('renders StaffProfile component', () => {
    const { container } = render(<StaffProfile {...props} />)
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

describe('StaffProfile with invalid data', () => {
  test('does not render thumbnail image when prop is null', () => {
    props.thumbnail = null
    const { container } = render(<StaffProfile {...props} />)
    const imageEl = container.querySelectorAll('img')

    expect(imageEl).toHaveLength(0)
  })

  test('does not render href when linkToBio is false', () => {
    props.linkToBio = false
    const { container } = render(<StaffProfile {...props} />)
    const aEl = container.querySelectorAll('a')

    expect(aEl).toHaveLength(2)
  })

  test('does not render description when prop is null', () => {
    props.description = null
    render(<StaffProfile {...props} />)

    expect(
      screen.queryByText(/OEF Transition Patient Advocate/)
    ).not.toBeInTheDocument()
  })

  test('does not render phone number when prop is null or empty', () => {
    props.phone = null
    render(<StaffProfile {...props} />)

    expect(screen.queryByText(/412-551-9651/)).not.toBeInTheDocument()

    props.phone = ''
    render(<StaffProfile {...props} />)

    expect(screen.queryByText(/412-551-9651/)).not.toBeInTheDocument()
  })

  test('does not render email address when prop is null or empty', () => {
    props.email = null
    render(<StaffProfile {...props} />)

    expect(
      screen.queryByText(/william.smathers@aol.com/)
    ).not.toBeInTheDocument()

    props.email = ''
    render(<StaffProfile {...props} />)

    expect(
      screen.queryByText(/william.smathers@aol.com/)
    ).not.toBeInTheDocument()
  })
})
