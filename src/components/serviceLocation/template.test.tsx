import { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import { ServiceLocation } from './template'
import type { PhoneNumber as PhoneNumberType } from '@/components/phoneNumber/formatted-type'

// Mock data for different test scenarios
const getBaseProps = (): ComponentProps<typeof ServiceLocation> => ({
  fieldReferralRequired: '1',
  mentalHealthPhoneNumber: {
    number: '555-1234',
    extension: '123',
    phoneType: 'tel',
  } as PhoneNumberType,
  mainPhoneString: '555-5678',
  isMentalHealthService: true,
  location: {
    fieldUseFacilityPhoneNumber: true,
    appointmentPhoneNumbers: [
      {
        id: '1',
        type: 'tel',
        number: '555-1111',
        extension: '',
        phoneType: 'tel',
        label: 'Appointments',
      },
      {
        id: '2',
        type: 'fax',
        number: '555-2222',
        extension: '456',
        phoneType: 'fax',
        label: 'Fax',
      },
    ],
    contactInfoPhoneNumbers: [
      {
        id: '3',
        type: 'tel',
        number: '555-3333',
        extension: '',
        phoneType: 'tel',
        label: 'Main contact',
      },
    ],
    fieldOfficeVisits: 'yes_appointment_only',
    fieldVirtualSupport: 'yes_veterans_can_call',
    fieldOnlineSchedulingAvail: 'yes',
    fieldServiceLocationAddress: {
      drupal_internal__id: 1,
      drupal_internal__revision_id: 1,
      type: '',
      langcode: 'en',
      id: '1',
      status: true,
      field_building_name_number: 'Building 1',
      field_clinic_name: 'Clinic A',
      field_wing_floor_or_room_number: 'Room 101',
      field_address: {
        langcode: 'en',
        country_code: 'US',
        address_line1: '123 Main St',
        address_line2: '',
        locality: 'Anytown',
        administrative_area: 'CA',
        postal_code: '12345',
      },
      field_use_facility_address: false,
    },
    fieldHours: '2',
    fieldOfficeHours: [
      {
        day: 1,
        starthours: 800,
        endhours: 1700,
        comment: 'Open',
      },
      {
        day: 2,
        starthours: 800,
        endhours: 1700,
        comment: 'Open',
      },
    ],
    fieldAdditionalHoursInfo: 'Closed on holidays',
    fieldUseMainFacilityPhone: true,
    fieldApptIntroTextType: 'use_default_text',
  },
})

describe('ServiceLocation', () => {
  test('renders basic information', () => {
    render(<ServiceLocation {...getBaseProps()} />)

    // Should render office visits info
    expect(
      screen.getByText('Visit our office, by appointment only')
    ).toBeInTheDocument()

    // Should render virtual support info
    expect(screen.getByText('Call at your convenience')).toBeInTheDocument()

    // Should render referral requirement
    expect(screen.getByText('A referral is required')).toBeInTheDocument()

    // Should render appointments header
    expect(
      screen.getByTestId('service-location-appoinments-header')
    ).toHaveTextContent('Appointments')
  })

  test('shows correct phone numbers', () => {
    render(<ServiceLocation {...getBaseProps()} />)

    // Main phone for appointments
    const mainPhoneElement = screen.getByTestId('main-phone-appointments')
    expect(mainPhoneElement).toHaveAttribute('contact', '5551234')

    // Other appointment phones
    const otherPhonesContainer = screen.getByTestId(
      'service-location-show-other-phone-numbers'
    )
    const vaTelephones = otherPhonesContainer.querySelectorAll('va-telephone')
    expect(vaTelephones[0]).toHaveAttribute('contact', '5551111')
    expect(vaTelephones[1]).toHaveAttribute('contact', '5552222')

    // Contact phone
    const contactPhonesContainer = screen.getByTestId(
      'service-location-show-contact-phone-numbers'
    )
    const contactPhone = contactPhonesContainer.querySelector('va-telephone')
    expect(contactPhone).toHaveAttribute('contact', '5553333')
  })

  test('shows service location address', () => {
    render(<ServiceLocation {...getBaseProps()} />)

    expect(screen.getByText('Building 1')).toBeInTheDocument()
    expect(screen.getByText('Room 101')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
    expect(screen.getByText('Anytown, CA 12345')).toBeInTheDocument()
  })

  test('shows online scheduling when available', () => {
    render(<ServiceLocation {...getBaseProps()} />)

    const linkAction = screen
      .getByTestId('service-location-action-link-online')
      .querySelector('va-link-action')
    expect(linkAction).toHaveAttribute('text', 'Schedule an appointment online')
    expect(linkAction).toHaveAttribute(
      'href',
      '/health-care/schedule-view-va-appointments'
    )
  })

  test('shows correct online scheduling link when VBA', () => {
    const props = { ...getBaseProps() }
    props.isVba = true
    render(<ServiceLocation {...props} />)

    const linkAction = screen
      .getByTestId('service-location-action-link-online')
      .querySelector('va-link-action')
    expect(linkAction).toHaveAttribute('text', 'Schedule an appointment online')
    expect(linkAction).toHaveAttribute(
      'href',
      'https://va.my.site.com/VAVERA/s/'
    )
  })

  test('shows service hours when available', () => {
    render(<ServiceLocation {...getBaseProps()} />)

    expect(screen.getByText('Service Hours')).toBeInTheDocument()

    // Not a great way to assert that the hours are associated with Monday and
    // Tuesday, but...we can be pretyt confident, anyhow
    expect(screen.getByText('Mon:')).toBeInTheDocument()
    expect(screen.getByText('Tue:')).toBeInTheDocument()
    expect(
      screen.getAllByText(/8:00 a\.m\. to 5:00 p\.m\.\s+Open/)
    ).toHaveLength(2)

    expect(screen.getByText('Closed on holidays')).toBeInTheDocument()
  })

  test('shows same-as-facility hours message', () => {
    const props = { ...getBaseProps() }
    props.location.fieldHours = '0'
    delete props.location.fieldOfficeHours

    render(<ServiceLocation {...props} />)

    expect(
      screen.getByText('The service hours are the same as our facility hours.')
    ).toBeInTheDocument()
  })

  test('does not show referral when not applicable', () => {
    const props = { ...getBaseProps() }
    props.fieldReferralRequired = 'not_applicable'

    render(<ServiceLocation {...props} />)

    expect(screen.queryByText('A referral is required')).not.toBeInTheDocument()
    expect(
      screen.queryByText('A referral is not required')
    ).not.toBeInTheDocument()
  })

  test('shows referral required when fieldReferralRequired is "1"', () => {
    const props = { ...getBaseProps() }
    props.fieldReferralRequired = '1'

    render(<ServiceLocation {...props} />)

    expect(screen.getByText('A referral is required')).toBeInTheDocument()
    expect(screen.getByTestId('referral-icon')).toHaveAttribute(
      'icon',
      'check_circle'
    )
  })

  test('shows referral not required when fieldReferralRequired is "0"', () => {
    const props = { ...getBaseProps() }
    props.fieldReferralRequired = '0'

    render(<ServiceLocation {...props} />)

    expect(screen.getByText('A referral is not required')).toBeInTheDocument()
    expect(screen.getByTestId('referral-icon')).toHaveAttribute(
      'icon',
      'cancel'
    )
  })

  test('shows custom appointment text', () => {
    const props = { ...getBaseProps() }
    props.location.fieldApptIntroTextType = 'customize_text'
    props.location.fieldApptIntroTextCustom = 'Custom appointment instructions'

    render(<ServiceLocation {...props} />)

    expect(
      screen.getByText('Custom appointment instructions')
    ).toBeInTheDocument()
  })
  test('does referral sentence if not VBA', () => {
    const props = { ...getBaseProps() }

    render(<ServiceLocation {...props} />)

    expect(
      screen.getByText(
        /If a referral is required, you’ll need to contact your primary care provider first./
      )
    ).toBeInTheDocument()
  })
  test('does not show referral sentence if VBA', () => {
    const props = { ...getBaseProps() }
    props.isVba = true

    render(<ServiceLocation {...props} />)

    expect(
      screen.queryByText(
        /If a referral is required, you’ll need to contact your primary care provider first./
      )
    ).not.toBeInTheDocument()
  })
  test('shows email contacts', () => {
    const props = { ...getBaseProps() }
    props.location.fieldEmailContacts = [
      {
        address: 'contact@example.com',
        label: 'General Inquiries',
        id: '1',
        type: 'paragraph--email_contact',
      },
    ]

    render(<ServiceLocation {...props} />)

    expect(screen.getByText('General Inquiries')).toBeInTheDocument()
    expect(
      screen.getByTestId('service-location-email-contact-0')
    ).toHaveAttribute('href', 'mailto:contact@example.com')
  })
  test('renders all h4s with no service header', () => {
    render(<ServiceLocation {...getBaseProps()} />)
    expect(screen.queryAllByRole('heading', { level: 4 })).toHaveLength(8)
  })
  test('renders service heading and other headings as h5 if service header', () => {
    const props = { ...getBaseProps() }
    props.serviceHeader = 'test header'
    render(<ServiceLocation {...props} />)
    expect(screen.queryAllByRole('heading', { level: 4 })).toHaveLength(1)
    expect(screen.queryAllByRole('heading', { level: 5 })).toHaveLength(8)
  })
})
