import { Meta, StoryObj } from '@storybook/react'
import PersonProfileTeaser from '@/templates/components/personProfileTeaser'

const meta: Meta<typeof PersonProfileTeaser> = {
  title: 'Components/Person Profile Teaser',
  component: PersonProfileTeaser,
}
export default meta

type Story = StoryObj<typeof PersonProfileTeaser>

export const TeaserWithBioPage: Story = {
  args: {
    completeBiographyCreate: true,
    description: 'Chief Experience Officer',
    emailAddress: 'brent-kratky@sample.com',
    entityPath: '/houston-health-care/staff-profiles/brent-kratky',
    firstName: 'Brent',
    lastName: 'Kratky',
    media: {
      id: 'c9711539-f785-4b8a-b897-f1537c92dad2',
      links: {
        '2_3_medium_thumbnail': {
          href: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/styles/2_3_medium_thumbnail/public/2022-04/Brent%20Kratky%20VA%20Headshot%20Jan%202021.jpg',
        },
      },
      alt: 'Brent Kratky',
      width: 1048,
      height: 1584,
      title: ''
    },
    office: 'VA Houston health care',
    phoneNumber: {
      id: '1234',
      type: 'paragraph--phone_number',
      label: 'Phone',
      extension: '12345',
      number: '000-859-5743',
      phoneType: 'tel',
    }
  },
}

export const TeaserWithoutBioPage: Story = {
  args: {
    completeBiographyCreate: false,
    entityPath: '/houston-health-care/staff-profiles/julianne-flynn',
    firstName: 'Julianne',
    lastName: 'Flynn',
    suffix: ', MD',
    media: {
      id: 'c9711539-f785-4b8a-b897-f1537c92dad2',
      links: {
        '2_3_medium_thumbnail': {
          href: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/styles/2_3_medium_thumbnail/public/2021-10/Flynn%20Oct.%202021.jpg',
        },
      },
      alt: 'Julianne Flynn',
      width: 1048,
      height: 1584,
      title: ''
    },
    office: 'VA Houston health care',
  },
}
