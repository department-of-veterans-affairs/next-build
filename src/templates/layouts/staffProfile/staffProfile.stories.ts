import { Meta, StoryObj } from '@storybook/react'

import { StaffProfile } from '@/templates/layouts/staffProfile'

const meta: Meta<typeof StaffProfile> = {
  title: 'Layout/Staff Profile',
  component: StaffProfile,
}
export default meta

type Story = StoryObj<typeof StaffProfile>

export const Full: Story = {
  args: {
    id: '2097c0e1-a396-4a5e-80bc-16a75c0b06ef',
    title: 'Prachi Asher',
    firstName: 'Prachi',
    lastName: 'Asher',
    suffix: ', FACHE',
    emailAddress: null,
    phoneNumber: {
      type: 'paragraph--phone_number',
      id: '1234',
      extension: null,
      label: null,
      phoneType: null,
      number: '412-822-3537',
    },
    description: 'Deputy Director',
    introText:
      'Prachi V. Asher, FACHE, is the deputy director of VA Pittsburgh Healthcare System (VAPHS), effective May 9, 2022. ',
    body: '<p>As deputy director, she oversees Biomedical Engineering, Environmental Management Service, Facilities Management Service, Financial Management Service, Police and Veterans Mobility Management.</p><p>Ms. Asher began her VA career in 2004 at VA Cincinnati Healthcare System and has held positions at VAPHS and VA Loma Linda Healthcare System. Prior to joining VAPHS, she served as associate director of resources at VA Greater Los Angeles Healthcare System. Most recently, she served a detail as the Veterans Integrated Service Network (VISN) 22 deputy network director.</p><p>Ms. Asher holds bachelor’s and master’s degrees in biomedical engineering from Wright State University in Dayton, Ohio. She received her Master of Health Services Administration and Master of Business Administration from Xavier University in Cincinnati, Ohio. She is a certified clinical engineer, fellow of the American College of Healthcare Executives and graduate of the Federal Executive Institute.</p>',
    media: {
      id: '673d386d-ec48-4094-9f6a-588c5e02cb9c',
      alt: 'as',
      links: {
        self: {
          href: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/styles/1_1_square_medium_thumbnail/public/2022-05/Asher-Prachi_20220510.jpg?h=fd53e8b6',
        },
      },
      title: 'image',
    },
    menu: {
      depth: 5,
      link: {
        label: 'Prachi Asher',
        url: { path: '/' },
        links: [],
      },
      parent: {
        label: 'Leadership',
        links: [],
        url: { path: `pittsburgh-health-care/about-us/leadership` },
      },
    },
    vamcOfficalName: 'VA Pittsburgh health care',
  },
}
