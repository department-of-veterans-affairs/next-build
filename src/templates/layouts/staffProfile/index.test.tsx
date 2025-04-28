import React from 'react'
import { render, screen } from '@testing-library/react'
import { MediaImage } from '@/types/formatted/media'
import { StaffProfile } from './index'
import { StaffProfile as FormattedStaffProfile } from '@/types/formatted/staffProfile'

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
      original: {
        href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/original/public/2021-04/Zachary_Sage.jpg',
        meta: {
          linkParams: {},
        },
      },
    },
  }
  const completeBiography = {
    value: 'public://2023-07/RCS Bio  Headshot.pdf',
    url: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/2023-07/RCS%20Bio%20%20Headshot.pdf',
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
    completeBiography: completeBiography,
    photoAllowHiresDownload: true,
    vamcTitle: 'VA Pittsburgh Healthcare System',
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
    expect(screen.getByTestId('phone')).toBeInTheDocument()
    expect(screen.getByText(mockProfile.introText)).toBeInTheDocument()

    expect(screen.getByTestId('head-shot-download')).toBeInTheDocument()
    expect(screen.getByTestId('head-shot-download')).toHaveAttribute(
      'href',
      'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/original/public/2021-04/Zachary_Sage.jpg'
    )
    expect(screen.getByTestId('head-shot-download')).toHaveAttribute(
      'filetype',
      'JPG'
    )
    expect(
      screen.getByTestId('complete-biography-download')
    ).toBeInTheDocument()
    expect(screen.getByTestId('complete-biography-download')).toHaveAttribute(
      'href',
      'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/2023-07/RCS%20Bio%20%20Headshot.pdf'
    )
    expect(screen.getByTestId('complete-biography-download')).toHaveAttribute(
      'filetype',
      'PDF'
    )
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
  test('does not render photo download option when photoAllowHiresDownload is false', () => {
    const modifiedProfile = {
      ...mockProfile,
      photoAllowHiresDownload: false,
    }
    render(<StaffProfile {...modifiedProfile} />)

    expect(screen.queryByTestId('head-shot-download')).not.toBeInTheDocument()
  })

  test('does not render bio download option when completeBiography is null', () => {
    const modifiedProfile = {
      ...mockProfile,
      completeBiography: null,
    }
    render(<StaffProfile {...modifiedProfile} />)

    expect(
      screen.queryByTestId('complete-biography-download')
    ).not.toBeInTheDocument()
  })

  describe('Lovell variants - tricare', () => {
    const modifiedProfile: FormattedStaffProfile = {
      ...mockProfile,
      menu: {
        depth: 5,
        link: { label: 'Prachi Asher', url: { path: '/' }, links: [] },
        parent: {
          label: 'Leadership',
          links: [],
          url: { path: '/leadership' },
        },
      },
      vamcTitle: 'Lovell Federal health care',
      lovellVariant: 'tricare',
      lovellSwitchPath: '/lovell-federal-health-care-va/leadership',
    }
    test('LovellSwitcher is rendered', () => {
      render(<StaffProfile {...modifiedProfile} />)

      expect(
        screen.getByText('You are viewing this page as a TRICARE beneficiary.')
      ).toBeInTheDocument()
    })
    test('shows the correct VAMC official name', () => {
      render(<StaffProfile {...modifiedProfile} />)

      expect(
        screen.getByText('Lovell Federal health care - TRICARE')
      ).toBeInTheDocument()
    })
  })
  describe('Lovell variants - va', () => {
    const modifiedProfile: FormattedStaffProfile = {
      ...mockProfile,
      menu: {
        depth: 5,
        link: { label: 'Prachi Asher', url: { path: '/' }, links: [] },
        parent: {
          label: 'Leadership',
          links: [],
          url: { path: '/leadership' },
        },
      },
      vamcTitle: 'Lovell Federal health care',
      lovellVariant: 'va',
      lovellSwitchPath: '/lovell-federal-health-care-tricare/leadership',
    }
    test('LovellSwitcher is rendered', () => {
      render(<StaffProfile {...modifiedProfile} />)

      expect(
        screen.getByText('You are viewing this page as a VA beneficiary.')
      ).toBeInTheDocument()
    })
    test('shows the correct VAMC official name', () => {
      render(<StaffProfile {...modifiedProfile} />)

      expect(
        screen.getByText('Lovell Federal health care - VA')
      ).toBeInTheDocument()
    })
  })
})
