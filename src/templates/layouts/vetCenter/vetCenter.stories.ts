import { Meta, StoryObj } from '@storybook/react'
import { VetCenter } from './index'
import { mockResponse } from '@/mocks/vetCenter.mock'
import { formatter } from '@/data/queries/vetCenter'
import { Wysiwyg as FormattedWysiwg } from '@/types/formatted/wysiwyg'
import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'

const meta: Meta<typeof VetCenter> = {
  title: 'Layouts/VetCenter',
  component: VetCenter,
}
export default meta

type Story = StoryObj<typeof VetCenter>

export const Example: Story = {
  args: {
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
      type: 'paragraph--wysiwyg',
      html: '<p>We also have non-traditional hours that change periodically given our community’s needs. Please call us to find out more.</p>',
    },
    ccVetCenterCallCenter: {
      id: '1',
      type: 'paragraph--wysiwyg',
      html: '<p>Our call center is available 24/7. Call us anytime at <a href="tel:+18779278387" aria-label="8 7 7. 9 2 7. 8 3 8 7.">877-927-8387</a>.</p>',
    },
    ccVetCenterFaqs: {
      type: 'paragraph--q_a_section',
      id: '5f582f12-b72f-4a35-a9df-411485c8e446',
      header: 'How we’re different than a clinic',
      intro: 'Click on a topic for more details.',
      displayAccordion: true,
      questions: [
        {
          id: '29903',
          type: 'paragraph--q_a_section' as FormattedQaSection['type'],
          question: 'What are Vet Centers?',
          answers: [
            {
              type: 'paragraph--wysiwyg' as FormattedWysiwg['type'],
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
        type: 'paragraph--featured_content',
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
        type: 'paragraph--featured_content',
        title: 'Group Session Available Virtual and In Person',
        description:
          '<p><strong>Vietnam Era Group -&nbsp;</strong>Tues 1-3pm</p>\n<p><strong>Vietnam Era Group - </strong>Wed 1-3pm</p>\n<p><strong>African American Vietnam Group at the Heinz VAMC </strong>1st, 2nd, 4th Thurs 4:30-6:30 pm</p>\n<p><strong>Strength at Home Couples Group&nbsp;</strong>Wed 9-11am</p>\n<p><strong>OIF/OEF Group-</strong>&nbsp;2nd &amp; 4th Mon 6-7:30pm</p>\n<p>&nbsp;</p>\n',
        link: null,
      },
    ],
    introText: 'Test introText',
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
    prepareForVisit: null,
    title: 'Test title',
    fieldFacilityLocatorApiId: 'Test API ID',
    path: 'Test title',
  },
}
