import React from 'react'
import { render, screen } from '@testing-library/react'
import { MediaImage } from '@/types/formatted/media'
import { StaffProfile } from './index'

describe('StaffProfile Component', () => {
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
  const mockProfile = {
    firstName: 'Prachi',
    lastName: 'Asher',
    suffix: ', FACHE',
    emailAddress: null,
    phoneNumber: {
      type: 'paragraph--phone_number',
      id: '1234',
      extension: null,
      label: null,
      phoneType: null,
      number: '412-822-3537',
    },
    introText:
      'Prachi V. Asher, FACHE, is the deputy director of VA Pittsburgh Healthcare System (VAPHS), effective May 9, 2022.',
    description: 'Deputy Director',
    body: '<p>Some biography text here.</p>',
    completeBiographyCreate: true,
    vamcOfficalName: 'VA Pittsburgh Healthcare System',
    media: mediaImage,
    menu: {
      depth: 5,
      link: { label: 'Prachi Asher', url: { path: '/' }, links: [] },
      parent: {
        label: 'Leadership',
        links: [],
        url: { path: '/leadership' },
      },
    },
    id: '1',
    type: 'staff',
    published: true,
    title: 'p',
    lastUpdated: '2/2/25',
  }

  test('renders StaffProfile with correct data', () => {
    render(<StaffProfile {...mockProfile} />)

    expect(screen.getByText('Prachi Asher')).toBeInTheDocument()
    expect(screen.getByText('Deputy Director')).toBeInTheDocument()
    expect(
      screen.getByText('VA Pittsburgh Healthcare System')
    ).toBeInTheDocument()
    expect(screen.getByText('Phone:')).toBeInTheDocument()
    expect(screen.getByTestId('profile-phone')).toBeInTheDocument()
    expect(screen.getByText(mockProfile.introText)).toBeInTheDocument()
  })

  test('does not render email when it is null', () => {
    render(<StaffProfile {...mockProfile} />)
    expect(screen.queryByText('Email:')).not.toBeInTheDocument()
  })

  test('hides optional fields when missing', () => {
    const modifiedProfile = {
      ...mockProfile,
      description: null,
      emailAddress: null,
      phoneNumber: null,
      media: null,
    }

    render(<StaffProfile {...modifiedProfile} />)

    expect(screen.queryByText('Deputy Director')).not.toBeInTheDocument()
    expect(screen.queryByText('Email:')).not.toBeInTheDocument()
    expect(screen.queryByText('Phone:')).not.toBeInTheDocument()
  })
})
