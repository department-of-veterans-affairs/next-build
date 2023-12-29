import { Meta, StoryObj } from '@storybook/react'

import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
import { MediaImage } from '@/types/formatted/media'

const mediaImage: MediaImage = {
  id: '3d6716b3-fb66-4e63-9b21-bb9c024129d3',
  links: {
    '2_1_large': {
      href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
      meta: {
        linkParams: {
          width: 318,
          height: 159,
        },
      },
    },
  },
  alt: 'Smiling man in glasses.',
  title: '',
  width: 318,
  height: 159,
}

const meta: Meta<typeof NewsStoryTeaser> = {
  title: 'Components/News Story Teaser',
  component: NewsStoryTeaser,
}
export default meta

type Story = StoryObj<typeof NewsStoryTeaser>

export const Teaser = {
  args: {
    headingLevel: 'h2',
    title: 'We honor outstanding doctors',
    introText:
      'When a hospital has a host of great doctors, honoring just two every year is challenging.',
    link: '#',
    image: mediaImage,
  },
}
