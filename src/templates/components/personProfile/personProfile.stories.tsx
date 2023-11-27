import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { PersonProfile as FormattedPersonProfile } from '@/types/dataTypes/formatted/personProfile'
import { MediaImage } from '@/types/dataTypes/formatted/media'
import { PersonProfile } from '@/templates/components/personProfile'

const mediaImage: MediaImage = {
  id: '3',
  alt: 'Raab Steele outreach and community engagement specialist',
  title: 'Raab Steele',
  width: 151,
  height: 227,
  imageStyle: '2_3_medium_thumbnail',
  url: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_3_medium_thumbnail/public/2021-04/Zachary_Sage.jpg',
  link: {
    '2_3_medium_thumbnail': {
      href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_3_medium_thumbnail/public/2021-04/Zachary_Sage.jpg',
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
  path: '/illiana-health-care/staff-profiles/zachary-m-sage/',
  entityId: 1234,
  entityPath: 'sample/path',
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
}

export default {
  title: 'Components/Person Profile',
  component: PersonProfile,
} as ComponentMeta<typeof PersonProfile>

const Template: ComponentStory<typeof PersonProfile> = (args) => (
  <PersonProfile {...args} />
)

export const Profile = Template.bind({})
Profile.args = personProfileData
