import { render, screen } from '@testing-library/react'
import { VetCenter } from './index'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'
import { FeaturedContent as FormattedFeaturedContent } from '@/types/formatted/featuredContent'
import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'

describe('VetCenter with valid data', () => {
  const mockData = {
    address: {
      langcode: 'en',
      country_code: 'US',
      administrative_area: 'PA',
      locality: 'Pittsburgh',
      address_line1: '1010 Delafield Road',
      address_line2: '',
    },
    ccNonTraditionalHours: {
      id: '1',
      type: 'paragraph--wysiwyg' as FormattedWysiwyg['type'],
      html: '<p>We also have non-traditional hours that change periodically given our community’s needs. Please call us to find out more.</p>',
    },
    ccVetCenterCallCenter: {
      id: '1',
      type: 'paragraph--wysiwyg' as FormattedWysiwyg['type'],
      html: '<p>Our call center is available 24/7. Call us anytime at <a href="tel:+18779278387" aria-label="8 7 7. 9 2 7. 8 3 8 7.">877-927-8387</a>.</p>',
    },
    ccVetCenterFaqs: {
      type: 'paragraph--q_a_section' as FormattedQaSection['type'],
      id: '5f582f12-b72f-4a35-a9df-411485c8e446',
      header: 'How we’re different than a clinic',
      intro: 'Select a topic to learn more.',
      displayAccordion: true,
      questions: [
        {
          id: '29903',
          type: 'paragraph--q_a_section' as FormattedQaSection['type'],
          question: 'What are Vet Centers?',
          answers: [
            {
              type: 'paragraph--wysiwyg' as FormattedWysiwyg['type'],
              id: '1',
              html: '<p>Vet Centers are small, non-medical, counseling centers conveniently located in your community. They’re staffed by highly trained counselors and team members dedicated to seeing you through the challenges that come with managing life during and after the military.</p>\r\n\r\n<p>Whether you come in for one-on-one counseling or to participate in a group session, at Vet Centers you can form social connections, try new things, and build a support system with people who understand you and want to help you succeed.</p>\r\n',
            },
          ],
          header: 'Vet Center -- Facility pages > Content > Questions',
        },
      ],
    },
    geolocation: {
      value: 'POINT (-80.05719073 40.42665609)',
      geo_type: 'Point',
      lat: 40.42665609,
      lon: -80.05719073,
      left: -80.05719073,
      top: 40.42665609,
      right: -80.05719073,
      bottom: 40.42665609,
      geohash: 'dppjfr2nk4zuym',
      latlon: '40.42665609,-80.05719073',
    },
    featuredContent: [
      {
        id: '1',
        type: 'paragraph--featured_content' as FormattedFeaturedContent['type'],
        title: 'New Vet Centers and Satellite Locations Announced',
        description:
          '<p>To improve access to counseling, we are adding three Vet Centers and six satellite locations across the US and its territories. We will continue to expand our program to meet Veteran demand and provide local support to those who served.&nbsp;</p>\n',
        link: {
          id: '32956',
          url: 'https://www.vetcenter.va.gov/New_Vet_Centers.asp',
          label: 'View the new locations here!',
        },
      },
      {
        id: '2',
        type: 'paragraph--featured_content' as FormattedFeaturedContent['type'],
        title: 'Group Session Available Virtual and In Person',
        description:
          '<p><strong>Vietnam Era Group -&nbsp;</strong>Tues 1-3pm</p>\n<p><strong>Vietnam Era Group - </strong>Wed 1-3pm</p>\n<p><strong>African American Vietnam Group at the Heinz VAMC </strong>1st, 2nd, 4th Thurs 4:30-6:30 pm</p>\n<p><strong>Strength at Home Couples Group&nbsp;</strong>Wed 9-11am</p>\n<p><strong>OIF/OEF Group-</strong>&nbsp;2nd &amp; 4th Mon 6-7:30pm</p>\n<p>&nbsp;</p>\n',
        link: null,
      },
    ],
    introText: 'Test introText',
    missionExplainer: {
      heading: 'Our commitment',
      body: "<p>We offer a range of services, from talk therapy to recreational activities. Our team will work with you to identify your goals and make a plan to meet them. We'll help you and your family build meaningful connections to improve your quality of life.</p>",
    },
    officeHours: [
      { day: 0, starthours: null, endhours: null, comment: 'Closed' },
      { day: 1, starthours: 800, endhours: 1630, comment: '' },
      { day: 2, starthours: 800, endhours: 1630, comment: '' },
      { day: 3, starthours: 800, endhours: 1630, comment: '' },
      { day: 4, starthours: 800, endhours: 1630, comment: '' },
      { day: 5, starthours: 800, endhours: 1630, comment: '' },
      { day: 6, starthours: null, endhours: null, comment: 'Closed' },
    ],
    officialName: 'Test Name',
    phoneNumber: '123-456-7890',
    healthServices: [
      {
        name: 'PTSD care',
        vetCenterTypeOfCare: 'counseling',
        vetCenterFriendlyName: null,
        alsoKnownAs: null,
        vetCenterComConditions: null,
        commonlyTreatedCondition: null,
        vetCenterServiceDescription:
          'If you have symptoms of PTSD after a traumatic event, we can help. We offer assessment and support through private counseling and group therapy. We can also refer you to VA or community counseling for treatment and therapy resources.',
        description:
          '<p>If you have symptoms of PTSD after a traumatic event, we can help. We offer assessment and treatment support such as private counseling, group therapy and medication. It’s never too late to get help.</p>',
        body: '<p>Pittsburgh Vet Center offers individual and group counseling.</p><p>Specialty care includes</p><ul><li>Evidence based therapies such as; Cognitive Processing Therapy (CPT) and Prolonged Exposure (PE).</li><li>Whole health activities such as yoga and mindfulness</li><li>Seeking Safety for PTSD and substance abuse disorder dual diagnosis</li></ul>',
      },
      {
        name: 'Couples and family counseling',
        vetCenterTypeOfCare: 'referral',
        vetCenterFriendlyName: null,
        alsoKnownAs: null,
        vetCenterComConditions: null,
        commonlyTreatedCondition: null,
        vetCenterServiceDescription:
          'We offer couples and family counseling to support you as you work toward meeting your goals.',
        description:
          'We offer couples and family counseling to support you as you work toward meeting your goals.',
        body: '<p>Pittsburgh Vet Center counselors on-site to offer family and couples counseling.</p><p>Specialty care includes</p><ul><li>Couples counseling and support</li><li>Spouse and Significant Other groups</li></ul>',
      },
      {
        name: 'Military sexual trauma care',
        vetCenterTypeOfCare: 'other',
        vetCenterFriendlyName: null,
        alsoKnownAs: null,
        vetCenterComConditions: null,
        commonlyTreatedCondition: null,
        vetCenterServiceDescription:
          'If you experienced sexual assault or harassment during military service, we can help you get the counseling you need. Any Veteran or service member, including members of the National Guard and Reserve forces, who experienced military sexual trauma is eligible to receive counseling. This applies to people of all genders from any service era.',
        description:
          'Military sexual trauma can happen to both genders. If you experienced sexual assault or harassment during military service—no matter when you served—we provide counseling and treatment.',
        body: '<p>Pittsburgh Vet Center offers individual and group counseling by counselors with specific training related to military sexual trauma care.</p>',
      },
    ],

    counselingHealthServices: [
      {
        name: 'PTSD care',
        vetCenterTypeOfCare: 'counseling',
        vetCenterFriendlyName: null,
        alsoKnownAs: null,
        vetCenterComConditions: null,
        commonlyTreatedCondition: null,
        vetCenterServiceDescription:
          'If you have symptoms of PTSD after a traumatic event, we can help. We offer assessment and support through private counseling and group therapy. We can also refer you to VA or community counseling for treatment and therapy resources.',
        description:
          '<p>If you have symptoms of PTSD after a traumatic event, we can help. We offer assessment and treatment support such as private counseling, group therapy and medication. It’s never too late to get help.</p>',
        body: '<p>Pittsburgh Vet Center offers individual and group counseling.</p><p>Specialty care includes</p><ul><li>Evidence based therapies such as; Cognitive Processing Therapy (CPT) and Prolonged Exposure (PE).</li><li>Whole health activities such as yoga and mindfulness</li><li>Seeking Safety for PTSD and substance abuse disorder dual diagnosis</li></ul>',
      },
    ],
    referralHealthServices: [
      {
        name: 'Couples and family counseling',
        vetCenterTypeOfCare: 'referral',
        vetCenterFriendlyName: null,
        alsoKnownAs: null,
        vetCenterComConditions: null,
        commonlyTreatedCondition: null,
        vetCenterServiceDescription:
          'We offer couples and family counseling to support you as you work toward meeting your goals.',
        description:
          'We offer couples and family counseling to support you as you work toward meeting your goals.',
        body: '<p>Pittsburgh Vet Center counselors on-site to offer family and couples counseling.</p><p>Specialty care includes</p><ul><li>Couples counseling and support</li><li>Spouse and Significant Other groups</li></ul>',
      },
    ],
    otherHealthServices: [
      {
        name: 'Military sexual trauma care',
        vetCenterTypeOfCare: 'other',
        vetCenterFriendlyName: null,
        alsoKnownAs: null,
        vetCenterComConditions: null,
        commonlyTreatedCondition: null,
        vetCenterServiceDescription:
          'If you experienced sexual assault or harassment during military service, we can help you get the counseling you need. Any Veteran or service member, including members of the National Guard and Reserve forces, who experienced military sexual trauma is eligible to receive counseling. This applies to people of all genders from any service era.',
        description:
          'Military sexual trauma can happen to both genders. If you experienced sexual assault or harassment during military service—no matter when you served—we provide counseling and treatment.',
        body: '<p>Pittsburgh Vet Center offers individual and group counseling by counselors with specific training related to military sexual trauma care.</p>',
      },
    ],
    image: {
      id: '3d6716b3-fb66-4e63-9b21-bb9c024129d3',
      links: {
        '2_1_large': {
          href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
          meta: {
            linkParams: {
              width: 700,
              height: 350,
            },
          },
        },
      },
      alt: 'Smiling man in glasses.',
      title: '',
      width: 700,
      height: 350,
    },
    bannerImage: {
      id: 'banner-image-id',
      links: {
        '2_1_large': {
          href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/banner-image.jpg',
          meta: {
            linkParams: {
              width: 1200,
              height: 600,
            },
          },
        },
      },
      alt: 'Banner image for vet center',
      title: '',
      width: 1200,
      height: 600,
    },
    prepareForVisit: null,
    title: 'Test title',
    fieldFacilityLocatorApiId: 'Test API ID',
    path: 'Test title',
    id: '1',
    type: 'node--vet_center',
    published: true,
    lastUpdated: '',
    lastSavedByAnEditor: '',
    operatingStatusFacility: '',
    operatingStatusMoreInfo: '',
    timezone: '',
    administration: undefined,
  }

  test('renders VetCenter component', () => {
    const { container } = render(<VetCenter {...mockData} />)
    const imgEl = container.querySelectorAll('img')
    expect(imgEl).toBeTruthy()
    expect(screen.queryByText(/Test introText/)).toBeInTheDocument()
    expect(screen.queryByText(/1010 Delafield Road/)).toBeInTheDocument()
    expect(screen.queryByText(/In the spotlight/)).toBeInTheDocument()
  })

  test('renders schema.org structured data scripts correctly', () => {
    const { container } = render(<VetCenter {...mockData} />)

    // Get all script tags with type="application/ld+json"
    const scriptTags = container.querySelectorAll(
      'script[type="application/ld+json"]'
    )

    // Should have at least 2 script tags (main place data + health services)
    expect(scriptTags.length).toBeGreaterThan(1)

    // Extract and parse the JSON from each script tag
    const scriptContents = Array.from(scriptTags).map((script) => {
      return JSON.parse((script as HTMLScriptElement).innerHTML)
    })

    // Take snapshot of the structured data to ensure consistency
    expect(scriptContents).toMatchSnapshot()
  })

  describe('Also called functionality', () => {
    test('renders "Also called" text when officialName is different from title', () => {
      const dataWithDifferentOfficialName = {
        ...mockData,
        title: 'Pittsburgh Vet Center',
        officialName: 'Pittsburgh Veterans Center for Readjustment',
      }

      render(<VetCenter {...dataWithDifferentOfficialName} />)

      // Should render the "Also called" text
      expect(
        screen.getByText(
          'Also called the Pittsburgh Veterans Center for Readjustment'
        )
      ).toBeInTheDocument()

      // Should have the h1 with aria-describedby pointing to the "Also called" element
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveAttribute('aria-describedby', 'vet-center-title')

      // Should have the correct ID on the "Also called" paragraph
      const alsoCalledElement = screen.getByText(
        'Also called the Pittsburgh Veterans Center for Readjustment'
      )
      expect(alsoCalledElement).toHaveAttribute('id', 'vet-center-title')
    })

    test('does not render "Also called" text when officialName is same as title', () => {
      const dataWithSameNames = {
        ...mockData,
        title: 'Pittsburgh Vet Center',
        officialName: 'Pittsburgh Vet Center',
      }

      render(<VetCenter {...dataWithSameNames} />)

      // Should not render the "Also called" text
      expect(screen.queryByText(/Also called the/)).not.toBeInTheDocument()

      // h1 should not have aria-describedby attribute
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).not.toHaveAttribute('aria-describedby')
    })

    test('does not render "Also called" text when officialName is null', () => {
      const dataWithNullOfficialName = {
        ...mockData,
        title: 'Pittsburgh Vet Center',
        officialName: null,
      }

      render(<VetCenter {...dataWithNullOfficialName} />)

      // Should not render the "Also called" text
      expect(screen.queryByText(/Also called the/)).not.toBeInTheDocument()

      // h1 should not have aria-describedby attribute
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).not.toHaveAttribute('aria-describedby')
    })

    test('does not render "Also called" text when officialName is empty string', () => {
      const dataWithEmptyOfficialName = {
        ...mockData,
        title: 'Pittsburgh Vet Center',
        officialName: '',
      }

      render(<VetCenter {...dataWithEmptyOfficialName} />)

      // Should not render the "Also called" text
      expect(screen.queryByText(/Also called the/)).not.toBeInTheDocument()

      // h1 should not have aria-describedby attribute
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).not.toHaveAttribute('aria-describedby')
    })

    test('does not render "Also called" when title is null but officialName exists', () => {
      const dataWithNullTitle = {
        ...mockData,
        title: null,
        officialName: 'Pittsburgh Veterans Center for Readjustment',
      }

      render(<VetCenter {...dataWithNullTitle} />)

      // Should not render the "Also called" text when title is null
      expect(screen.queryByText(/Also called the/)).not.toBeInTheDocument()
    })
  })

  test('renders ExpandableOperatingStatus when operating status is provided', () => {
    const testDataWithOperatingStatus = {
      ...mockData,
      operatingStatusFacility: 'limited' as const,
      operatingStatusMoreInfo: 'Limited hours due to maintenance',
    }

    const { container } = render(<VetCenter {...testDataWithOperatingStatus} />)

    expect(container.querySelector('va-alert-expandable')).toBeInTheDocument()
    expect(
      screen.getByText('Limited hours due to maintenance')
    ).toBeInTheDocument()
  })

  test('renders phone number with standardized PhoneNumber component', () => {
    render(<VetCenter {...mockData} />)

    // Check that the phone number is displayed with "Main phone" label
    expect(screen.getByText(/Main phone:/)).toBeInTheDocument()

    // Check that the phone number is rendered using the va-telephone component
    const phoneElement = screen.getByTestId('phone')
    expect(phoneElement).toBeInTheDocument()

    // Check that the va-telephone component is present
    const vaTelephoneElement = document.querySelector('va-telephone')
    expect(vaTelephoneElement).toBeInTheDocument()

    // Verify the contact attribute contains the phone number without dashes
    expect(vaTelephoneElement?.getAttribute('contact')).toBe('1234567890')
  })

  describe('Mission Explainer functionality', () => {
    test('renders mission explainer when data is present', () => {
      render(<VetCenter {...mockData} />)

      // Check that the mission explainer va-summary-box is rendered
      const summaryBox = document.querySelector('va-summary-box')
      expect(summaryBox).toBeInTheDocument()

      // Check that the heading is rendered correctly
      expect(screen.getByText('Our commitment')).toBeInTheDocument()

      // Check that the body content is rendered
      expect(
        screen.getByText(/We offer a range of services/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/talk therapy to recreational activities/)
      ).toBeInTheDocument()
    })

    test('does not render mission explainer when data is missing', () => {
      const dataWithoutMissionExplainer = {
        ...mockData,
        missionExplainer: null,
      }

      render(<VetCenter {...dataWithoutMissionExplainer} />)

      // Check that the mission explainer va-summary-box is not rendered
      const summaryBox = document.querySelector('va-summary-box')
      expect(summaryBox).not.toBeInTheDocument()
    })
  })
})
