import React from 'react'
import { render, screen } from '@testing-library/react'
import { StaffProfileParagraph } from './template'
import { StaffProfileParagraph as FormattedStaffProfileParagraph } from './formatted-type'

const mockStaffProfileData: FormattedStaffProfileParagraph = {
  type: 'paragraph--staff_profile',
  id: 'test-id',
  entityId: 123,
  firstName: 'John',
  lastName: 'Doe',
  suffix: 'Jr.',
  emailAddress: 'john.doe@va.gov',
  phoneNumber: {
    type: 'paragraph--phone_number',
    id: 'phone-id',
    entityId: 456,
    number: '555-123-4567',
    extension: '123',
    phoneType: 'tel',
  },
  description: 'Test Description',
  introText: 'Test Intro',
  body: 'Test Body',
  media: {
    id: 'media-id',
    alt: 'Photo of John Doe',
    title: 'John Doe Photo',
    width: 200,
    height: 200,
    links: {
      '1_1_square_medium_thumbnail': {
        href: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/styles/1_1_square_medium_thumbnail/public/2020-04/Bob_Askey.jpg',
      },
    },
  },
  completeBiographyCreate: true,
  photoAllowHiresDownload: false,
  vamcTitle: 'Test VAMC Title',
}

describe('StaffProfileParagraph', () => {
  test('renders with complete data', () => {
    render(<StaffProfileParagraph {...mockStaffProfileData} />)

    // Check that the main container is rendered
    expect(screen.getByText('John Doe Jr.')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test VAMC Title')).toBeInTheDocument()
    expect(screen.getByText('john.doe@va.gov')).toBeInTheDocument()
  })

  test('returns null when no firstName and lastName', () => {
    const emptyData: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      firstName: '',
      lastName: '',
    }

    const { container } = render(<StaffProfileParagraph {...emptyData} />)
    expect(container.firstChild).toBeNull()
  })

  test('renders media image when provided', () => {
    render(<StaffProfileParagraph {...mockStaffProfileData} />)
    expect(
      screen.getByRole('img', { name: 'Photo of John Doe' })
    ).toBeInTheDocument()
  })

  test('handles missing media with fallback icon', () => {
    const dataWithoutMedia: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      media: null,
    }

    const { container } = render(
      <StaffProfileParagraph {...dataWithoutMedia} />
    )

    const vaIcon = container.querySelector('va-icon')
    expect(vaIcon).toBeInTheDocument()
    expect(vaIcon).toHaveAttribute('icon', 'person')
  })

  test('renders name with suffix correctly', () => {
    const dataWithSuffix: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      firstName: 'John',
      lastName: 'Doe',
      suffix: 'Jr.',
    }
    render(<StaffProfileParagraph {...dataWithSuffix} />)
    expect(screen.getByText('John Doe Jr.')).toBeInTheDocument()
  })

  test('renders name without suffix correctly', () => {
    const dataWithoutSuffix: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      firstName: 'John',
      lastName: 'Doe',
      suffix: undefined,
    }

    render(<StaffProfileParagraph {...dataWithoutSuffix} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  test('renders complete biography link when completeBiographyCreate is true', () => {
    const dataWithBiography: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      completeBiographyCreate: true,
    }
    render(<StaffProfileParagraph {...dataWithBiography} />)

    const link = screen.getByRole('link', { name: 'John Doe Jr.' })
    expect(link).toHaveAttribute('href', '/staff-profiles/john-doe')
  })

  test('renders plain text name when completeBiographyCreate is false', () => {
    const dataWithoutBiography: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      completeBiographyCreate: false,
    }

    render(<StaffProfileParagraph {...dataWithoutBiography} />)

    expect(screen.getByText('John Doe Jr.')).toBeInTheDocument()
    // Should not have a link for the name
    const nameLinks = screen
      .queryAllByRole('link')
      .filter((link) => link.textContent === 'John Doe Jr.')
    expect(nameLinks).toHaveLength(0)
  })

  test('renders description when provided', () => {
    const dataWithDescription: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      description: 'Custom Description',
    }
    render(<StaffProfileParagraph {...dataWithDescription} />)
    expect(screen.getByText('Custom Description')).toBeInTheDocument()
  })

  test('renders vamcTitle when provided', () => {
    const dataWithVamcTitle: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      vamcTitle: 'Custom VAMC Title',
    }
    render(<StaffProfileParagraph {...dataWithVamcTitle} />)
    expect(screen.getByText('Custom VAMC Title')).toBeInTheDocument()
  })

  test('renders phone number when provided', () => {
    const dataWithPhone: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      phoneNumber: {
        type: 'paragraph--phone_number',
        id: 'phone-id',
        entityId: 456,
        number: '555-123-4567',
        extension: '123',
        phoneType: 'tel',
      },
    }
    render(<StaffProfileParagraph {...dataWithPhone} />)
    expect(screen.getByText('Phone:')).toBeInTheDocument()
  })

  test('renders email when provided', () => {
    const dataWithEmail: FormattedStaffProfileParagraph = {
      ...mockStaffProfileData,
      emailAddress: 'test@example.com',
    }
    render(<StaffProfileParagraph {...dataWithEmail} />)
    const emailLink = screen.getByRole('link', { name: 'test@example.com' })
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com')
    expect(emailLink).toHaveAttribute('target', '_blank')
    expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
