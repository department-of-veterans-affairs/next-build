import React from 'react'
import { render, screen } from '@testing-library/react'
import { StaffProfile } from './index'

describe('StaffProfile Component', () => {
  const mockProfile = {
    firstName: 'Prachi',
    lastName: 'Asher',
    suffix: ', FACHE',
    emailAddress: null,
    phoneNumber: '412-360-6101',
    introText:
      'Prachi V. Asher, FACHE, is the deputy director of VA Pittsburgh Healthcare System (VAPHS), effective May 9, 2022.',
    description: 'Deputy Director',
    body: '<p>Some biography text here.</p>',
    completeBiographyCreate: true,
    vamcOfficalName: 'VA Pittsburgh Healthcare System',
    media: {
      id: '673d386d-ec48-4094-9f6a-588c5e02cb9c',
      alt: 'Profile image',
      links: {
        self: {
          href: 'https://example.com/profile.jpg',
        },
      },
      title: 'Profile Picture',
    },
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
    expect(screen.getByText('412-360-6101')).toBeInTheDocument()
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
