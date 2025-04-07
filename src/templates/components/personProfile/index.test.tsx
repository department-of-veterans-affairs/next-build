import { render, screen } from 'test-utils'
import { PersonProfile } from '@/templates/components/personProfile/index'
import { PersonProfile as FormattedPersonProfile } from '@/types/formatted/personProfile'
import { MediaImage } from '@/types/formatted/media'
import { StaffNewsProfile } from '@/templates/components/personProfile/index'

const mediaImage: MediaImage = {
  id: '3',
  alt: 'Heather Steele outreach and community engagement specialist',
  title: 'Heather Steele',
  width: 151,
  height: 227,
  links: {
    '1_1_square_medium_thumbnail': {
      href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/1_1_square_medium_thumbnail/public/2021-04/Zachary_Sage.jpg',
      meta: {
        linkParams: {},
      },
    },
    '2_3_medium_thumbnail': {
      href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_3_medium_thumbnail/public/2021-04/Zachary_Sage.jpg',
      meta: {
        linkParams: {},
      },
    },
  },
}

const personProfileData: FormattedPersonProfile = {
  firstName: 'Heather',
  lastName: 'Steele',
  suffix: null,
  emailAddress: 'test@va.gov',
  phoneNumber: {
    type: 'paragraph--phone_number',
    id: '1234',
    extension: null,
    label: null,
    phoneType: null,
    number: '412-822-3537',
  },
  description: 'Program coordinator for minority Veterans',
  introText: 'Intro text',
  body: 'Intro text',
  media: mediaImage,
  completeBiography: {
    url: '/pittsburgh-health-care/staff-profiles/raab-john',
  },
  completeBiographyCreate: true,
  photoAllowHiresDownload: false,
  vamcOfficalName: 'Pittsburgh VA Medical Center',
  displayType: 'component',
}

describe('PersonProfile with valid data', () => {
  test('renders PersonProfile component', () => {
    const { container } = render(<PersonProfile {...personProfileData} />)
    const imageMeta = screen.getByRole('img')
    const aEl = container.querySelectorAll('va-link')

    expect(aEl).toHaveLength(2)

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
    expect(aEl[0]).toHaveAttribute('href', 'mailto:test@va.gov')
    expect(aEl[1]).toHaveAttribute('href', 'tel:412-822-3537')
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

    expect(screen.queryByText(/test@va.gov/)).not.toBeInTheDocument()

    personProfileData.emailAddress = ''
    render(<PersonProfile {...personProfileData} />)

    expect(screen.queryByText(/test@va.gov/)).not.toBeInTheDocument()
  })

  test('does not render phoneNumber when null or empty', () => {
    personProfileData.phoneNumber = null
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

describe('StaffNewsProfile', () => {
  test('renders byline with title and description', () => {
    const props = {
      title: 'John Smith',
      description: 'Staff Writer',
    }
    render(<StaffNewsProfile {...props} />)
    expect(screen.getByText('By John Smith, Staff Writer')).toBeInTheDocument()
    expect(screen.getByText('By John Smith, Staff Writer').tagName).toBe('P')
  })

  test('renders byline with title only when description is missing', () => {
    const props = {
      title: 'John Smith',
    }
    render(<StaffNewsProfile {...props} />)
    expect(screen.getByText('By John Smith')).toBeInTheDocument()
    expect(screen.getByText('By John Smith').tagName).toBe('P')
  })
})
