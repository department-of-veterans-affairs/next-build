import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { Event } from './'
import { recordEvent } from '@/lib/analytics/recordEvent'

jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

const data = {
  id: '',
  type: '',
  published: null,
  title: '',
  lastUpdated: '',
  image: null,
  date: '',
  socialLinks: undefined,
  listing: '',
  listingOffice: '',
  additionalInfo: undefined,
  address: undefined,
  locationHumanReadable: '',
  eventCTA: '',
  emailCTA: '',
  howToSignUp: '',
  cost: '',
  datetimeRange: undefined,
  body: undefined,
  locationType: '',
  description: '',
  link: undefined,
  urlOfOnlineEvent: undefined,
  facilityLocation: {
    type: 'node--health_care_local_facility',
    id: '1741a5af-05f4-4e71-83ce-f9a425dbdb91',
    drupal_internal__nid: 1111,
    drupal_internal__vid: 837565,
    langcode: 'en',
    changed: '2024-03-02T13:13:13+00:00',
    title: 'Aberdeen VA Clinic',
    status: null,
    created: '2019-10-31T19:52:10+00:00',
    sticky: null,
    default_langcode: null,
    path: null,
    resourceIdObjMeta: null,
    field_address: {
      langcode: null,
      country_code: 'US',
      administrative_area: 'SD',
      locality: 'Aberdeen',
      dependent_locality: null,
      postal_code: '57401-8027',
      address_line1: '3307 10th Avenue Southeast',
    },
    field_facility_classification: '3',
    field_operating_status_more_info: null,
    field_facility_locator_api_id: 'vha_438GD',
    field_local_health_care_service_: null,
    field_facility_hours: null,
    field_office_hours: null,
    field_media: null,
    field_location_services: null,
    field_main_location: null,
    field_mental_health_phone: '605-336-3230, ext. 6890',
    field_description:
      'Get address and hours, parking and transportation information, and health services offered at Aberdeen VA Clinic',
    field_mobile: null,
    field_intro_text:
      'Our outpatient clinic provides primary care to help you stay healthy and well throughout your life. Below, you’ll find our address and hours, parking and transportation information, and the other health services we offer at our Aberdeen VA Clinic.',
    field_phone_number: '605-229-3500',
    field_operating_status_facility: 'normal',
    field_region_page: null,
  },
  administration: {
    id: 0,
    name: '',
  },
}

describe('<Event /> Component', () => {
  const eventProps = {
    title: 'Test Event',
    description: 'Test Description',
    datetimeRange: [
      {
        value: '2024-03-22T10:00:00',
        end_value: '2024-03-22T12:00:00',
        duration: 200,
        rrule: 1,
        rrule_index: 1,
        timezone: '',
      },
    ],
    locationHumanReadable: 'Test Location',
    address: {
      address_line1: '123 Test St',
      locality: 'Test City',
      administrative_area: 'Test State',
      langcode: 'en',
      country_code: '123',
      address_line2: '',
    },
    cost: '$10',
    socialLinks: {
      title: 'test links',
      path: '/social-links',
    },
    link: {
      url: { path: '/event-link' },
    },
    urlOfOnlineEvent: {
      uri: '/online-event',
      title: 'online',
      options: [],
    },
    listing: 'more-events',
    listingOffice: 'Test Office',
    additionalInfo: {
      processed: '<p>Additional Info</p>',
      value: '<p>Additional Info</p>',
      format: 'text',
    },
    eventCTA: 'Register Now',
    emailCTA: 'Register via Email',
    howToSignUp: 'email',
    body: {
      processed: '<p>Event Body</p>',
      value: '<p>Event Body</p>',
      format: 'text',
    },
    administration: {
      id: 0,
      name: '',
    },
  }

  beforeEach(() => {
    render(
      <Event
        id={''}
        type={''}
        published={false}
        lastUpdated={''}
        image={{
          id: '',
          alt: '',
          title: '',
          width: 0,
          height: 0,
          links: { '2_1_large': { href: '/foo' } },
        }}
        date={''}
        facilityLocation={undefined}
        locationType={''}
        {...eventProps}
      />
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders event details correctly', () => {
    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test Location')).toBeInTheDocument()
    expect(screen.getByText('$10')).toBeInTheDocument()
    expect(screen.getByText('Event Body')).toBeInTheDocument()
  })

  it('renders online event information correctly', () => {
    const onlineEventProps = {
      ...eventProps,
      locationType: 'online',
      urlOfOnlineEvent: { uri: '/online-event', title: 'online', options: [] },
    }

    render(
      <Event
        id={''}
        type={''}
        published={false}
        lastUpdated={''}
        image={{
          id: '',
          alt: '',
          title: '',
          width: 0,
          height: 0,
          links: { '2_1_large': { href: '/foo' } },
        }}
        date={''}
        facilityLocation={undefined}
        {...onlineEventProps}
      />
    )
    expect(screen.getByText('This is an online event.')).toBeInTheDocument()
  })
  it('renders address', () => {
    render(<Event {...data} />)
    expect(screen.getByText('3307 10th Avenue Southeast')).toBeInTheDocument()
  })
})
