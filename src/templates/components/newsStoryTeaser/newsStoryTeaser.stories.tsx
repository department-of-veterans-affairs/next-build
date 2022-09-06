import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
import { MediaImageType } from '@/types/index'

const mediaImage: MediaImageType = {
  id: '3d6716b3-fb66-4e63-9b21-bb9c024129d3',
  link: {
    href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
    meta: {
      linkParams: {
        width: 318,
        height: 159,
      },
    },
  },
  alt: 'Smiling man in glasses.',
  title: '',
  width: 318,
  height: 159,
  url: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
}

export default {
  title: 'Components/News Story Teaser',
  component: NewsStoryTeaser,
} as ComponentMeta<typeof NewsStoryTeaser>

const Template: ComponentStory<typeof NewsStoryTeaser> = (args) => (
  <NewsStoryTeaser {...args} />
)

export const Teaser = Template.bind({})
Teaser.args = {
  headingLevel: 'h2',
  title: 'We honor outstanding doctors',
  introText:
    'When a hospital has a host of great doctors, honoring just two every year is challenging.',
  link: '#',
  image: mediaImage,
}
