import React from 'react'
import { render, screen } from '@testing-library/react'
import { StaffProfileTeaser } from './index'

const baseProps = {
  media: {
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
  },
  firstName: 'Jane',
  lastName: 'Doe',
  suffix: 'PhD',
  description: 'A great staff member.',
  vamcTitle: 'Chief of Staff',
  phoneNumber: {
    type: 'paragraph--phone_number',
    id: '1234',
    extension: null,
    label: null,
    phoneType: null,
    number: '412-822-3537',
  },
  link: '/profile/jane-doe',
  id: '123',
}

describe('StaffProfileTeaser', () => {
  it('renders all fields with link', () => {
    render(<StaffProfileTeaser {...baseProps} />)
    expect(screen.getByTestId('staff-profile-image')).toBeInTheDocument()
    expect(screen.getByText('A great staff member.')).toBeInTheDocument()
    expect(screen.getByText('Chief of Staff')).toBeInTheDocument()
    expect(screen.getByTestId('phone-number')).toHaveAttribute(
      'contact',
      '4128223537'
    )
    // Check va-link
    expect(screen.getByTestId('staff-profile-link')).toHaveAttribute(
      'href',
      '/profile/jane-doe'
    )
    expect(screen.getByTestId('staff-profile-link')).toHaveAttribute(
      'text',
      'Jane Doe PhD'
    )
  })

  it('renders name in span if no link', () => {
    render(<StaffProfileTeaser {...baseProps} link={undefined} />)
    expect(screen.getByText('Jane Doe PhD').tagName).toBe('SPAN')
  })

  it('does not render media if not provided', () => {
    render(<StaffProfileTeaser {...baseProps} media={undefined} />)
    expect(screen.queryByTestId('media-image')).not.toBeInTheDocument()
  })

  it('does not render description, vamcTitle, or phone if not provided', () => {
    render(
      <StaffProfileTeaser
        {...baseProps}
        description={undefined}
        vamcTitle={undefined}
        phoneNumber={undefined}
      />
    )
    expect(screen.queryByText('A great staff member.')).not.toBeInTheDocument()
    expect(screen.queryByText('Chief of Staff')).not.toBeInTheDocument()
    expect(screen.queryByTestId('phone-number')).not.toBeInTheDocument()
  })
})
