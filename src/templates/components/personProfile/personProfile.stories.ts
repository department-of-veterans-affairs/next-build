import { Meta, StoryObj } from '@storybook/react'

import { PersonProfile as FormattedPersonProfile } from '@/types/formatted/personProfile'
import { MediaImage } from '@/types/formatted/media'
import { PersonProfile } from '@/templates/components/personProfile'

const mediaImage: MediaImage = {
  id: '3',
  alt: 'Raab Steele outreach and community engagement specialist',
  title: 'Raab Steele',
  width: 151,
  height: 227,
  links: {
    '1_1_square_medium_thumbnail': {
      href: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/1_1_square_medium_thumbnail/public/2021-04/Zachary_Sage.jpg',
      meta: {
        linkParams: {
          width: 151,
          height: 227,
        },
      },
    },
  },
}

const personProfileData: FormattedPersonProfile = {
  id: '4406ee13-e60f-43f7-b969-13e2cd693c1b',
  type: 'node--person-profile',
  title: 'Zachary M. Sage',
  entityId: 1234,
  entityPath: '/illiana-health-care/staff-profiles/zachary-m-sage/',
  firstName: 'Zachary',
  lastName: 'Sage',
  suffix: null,
  emailAddress: 'zachary.sage@va.gov',
  phoneNumber: '217-554-5074',
  description: 'Associate Medical Center Director',
  introText:
    'VA Illiana Health Care System would like to welcome Mr. Zachary Sage, MHA, to the role of Associate Medical Center Director for VA Illiana Health Care System effective January 3, 2021.',
  body: `<p>Mr. Sage previously served as the Associate Director of Overton Brooks VA Medical Center, Interim Medical Center Director of Amarillo VA Health Care System, and Associate Director of VA Texas Valley Coastal Bend Health Care System.</p><p>Mr. Sage joined VA in 2007 as a Medical Support Assistant at Lexington VA Medical Center in Kentucky. He continued his career as an Administrative Fellow at Michael E. DeBakey VA Medical Center in Houston, Texas. Upon completion of his Fellowship, Mr. Sage continued serving at Michael E. DeBakey VA Medical Center as a Supply Systems Analyst for the Logistics Management Service, and then as Administrative Officer of the Diagnostic and Therapeutic Care Line. Mr. Sage also served as the Health Systems Specialist to the Associate Director at Robley Rex VA Medical Center in Louisville, Kentucky.</p><p>Mr. Sage earned his Master of Health Administration and Bachelor of Arts in Secondary Science Education from the University of Kentucky.  Mr. Sage is a member of the American College of Healthcare Executives (ACHE).</p>`,
  media: mediaImage,
  completeBiography: {
    url: '/illiana-health-care/staff-profiles/zachary-m-sage/',
  },
  completeBiographyCreate: true,
  photoAllowHiresDownload: false,
  vamcOfficalName: 'Pittsburgh VA Medical Center',
  office: null,
  published: true,
  lastUpdated: '2024-01-01T15:00:00.000Z',
}

const meta: Meta<typeof PersonProfile> = {
  title: 'Components/Person Profile',
  component: PersonProfile,
}
export default meta

type Story = StoryObj<typeof PersonProfile>

export const Profile: Story = {
  args: {
    ...personProfileData,
  },
}
