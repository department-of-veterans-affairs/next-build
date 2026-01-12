export const mockResponse = {
  address: {
    langcode: 'en',
    country_code: 'US',
    administrative_area: 'PA',
    locality: 'Pittsburgh',
    postal_code: '15215',
    address_line1: '1010 Delafield Road',
    address_line2: '',
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
  title: 'Test title',
  fieldFacilityLocatorApiId: 'Test API ID',
  path: '/test-vet-center/test-outstation',
  id: '1',
  type: 'node--vet_center_outstation',
  published: true,
  lastUpdated: '',
  lastSavedByAnEditor: '',
  operatingStatusFacility: '',
  operatingStatusMoreInfo: '',
  timezone: '',
  administration: null,
  prepareForVisit: null,
  featuredContent: null,
  ccNonTraditionalHours: null,
  ccVetCenterCallCenter: null,
  ccVetCenterFaqs: null,
}
