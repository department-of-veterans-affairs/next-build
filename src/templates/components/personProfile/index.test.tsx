import { render, screen } from 'test-utils'
import { PersonProfile } from '@/templates/components/personProfile/index'
import { PersonProfileType, MediaImageType } from '@/types/index'

const mediaImage: MediaImageType = {
  id: '3',
  alt: 'Heather Steele outreach and community engagement specialist',
  title: 'Heather Steele',
  width: 1299,
  height: 1512,
  imageStyle: '1_1_square_medium_thumbnail',
  url: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2020-08/Raab.jpg?h=d3381009',
  link: {
    href: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2020-08/Raab.jpg?h=d3381009',
    meta: {
      linkParams: {
        width: 100,
        height: 100,
      },
    },
  },
}

const personProfileData: PersonProfileType = {
  id: '4406ee13-e60f-43f7-b969-13e2cd693c1b',
  path: {
    alias: '/pittsburgh-health-care/staff-profiles/raab-john',
  },
  body: {
    processed: 'Intro text',
  },
  title: 'Heather Steele',
  completeBiography: 'Intro text',
  completeBiographyCreate: true,
  emailAddress: 'heather.steele@va.gov',
  firstName: 'Heather',
  introText: 'Intro text',
  photoAllowHiresDownload: false,
  description: 'Program coordinator for minority Veterans',
  lastName: 'Steele',
  phoneNumber: '412-822-3537',
  media: mediaImage,
  office: null,
  suffix: null,
}

describe('PersonProfile with valid data', () => {
  test('renders PersonProfile component', () => {
    const { container } = render(<PersonProfile {...personProfileData} />)
    const imageMeta = screen.getByRole('img')
    const aEl = container.querySelectorAll('a')

    expect(aEl).toHaveLength(3)

    //Thumbnail
    expect(imageMeta).toBeVisible()
    expect(imageMeta).toHaveAttribute(
      'alt',
      'Heather Steele outreach and community engagement specialist'
    )
    expect(imageMeta).toHaveAttribute('title', 'Heather Steele')

    //Bio
    expect(screen.queryByText(/Heather Steele/)).toBeInTheDocument()

    expect(
      screen.queryByText(/Program coordinator for minority Veterans/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/heather.steele@va.gov/)).toBeInTheDocument()
    expect(aEl[0]).toHaveAttribute('href', 'mailto:heather.steele@va.gov')
    expect(screen.queryByText(/412-822-3537/)).toBeInTheDocument()
    expect(aEl[1]).toHaveAttribute('href', 'tel:412-822-3537')

    expect(screen.queryByText(/Intro text/)).toBeInTheDocument()
    expect(screen.queryByText(/Download full bio/)).toBeInTheDocument()
  })
})

describe('PersonProfile with invalid data', () => {
  test('does not render Thumbnail when media is null', () => {
    personProfileData.media = null
    const { container } = render(<PersonProfile {...personProfileData} />)
    const imageEl = container.querySelectorAll('img')

    expect(imageEl).toHaveLength(0)
  })

  test('does not render description when description is null or empty', () => {
    personProfileData.description = null
    render(<PersonProfile {...personProfileData} />)

    expect(
      screen.queryByText(/Program coordinator for minority Veterans/)
    ).not.toBeInTheDocument()

    personProfileData.description = ''
    render(<PersonProfile {...personProfileData} />)

    expect(
      screen.queryByText(/Program coordinator for minority Veterans/)
    ).not.toBeInTheDocument()
  })

  test('does not render emailAddress when null or empty', () => {
    personProfileData.emailAddress = null
    render(<PersonProfile {...personProfileData} />)

    expect(screen.queryByText(/heather.steele@va.gov/)).not.toBeInTheDocument()

    personProfileData.emailAddress = ''
    render(<PersonProfile {...personProfileData} />)

    expect(screen.queryByText(/heather.steele@va.gov/)).not.toBeInTheDocument()
  })

  test('does not render phoneNumber when null or empty', () => {
    personProfileData.phoneNumber = null
    render(<PersonProfile {...personProfileData} />)

    expect(screen.queryByText(/412-822-3537/)).not.toBeInTheDocument()

    personProfileData.phoneNumber = ''
    render(<PersonProfile {...personProfileData} />)

    expect(screen.queryByText(/412-822-3537/)).not.toBeInTheDocument()
  })

  test('does not render body when completeBiographyCreate is false', () => {
    personProfileData.completeBiographyCreate = false
    render(<PersonProfile {...personProfileData} />)

    expect(screen.queryByText(/Intro text/)).not.toBeInTheDocument()
    expect(screen.queryByText(/The body is here/)).not.toBeInTheDocument()
  })

  test('does not render photo download option when photoAllowHiresDownload is false', () => {
    personProfileData.photoAllowHiresDownload = false
    render(<PersonProfile {...personProfileData} />)

    expect(
      screen.queryByText(/Download full size photo/)
    ).not.toBeInTheDocument()
  })

  test('does not render bio download option when completeBiography is null', () => {
    personProfileData.completeBiography = null
    render(<PersonProfile {...personProfileData} />)

    expect(screen.queryByText(/Download full bio/)).not.toBeInTheDocument()
  })
})
