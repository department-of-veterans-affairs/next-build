import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
import { MediaImageType } from '@/types/index'

const mediaImage: MediaImageType = {
  id: '3d6716b3-fb66-4e63-9b21-bb9c024129d3',
  link: {
    href: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2020-08/Raab.jpg?h=d3381009',
    meta: {
      linkParams: {
        width: 100,
        height: 100,
      },
    },
  },
  alt: 'Smiling man in glasses.',
  title: '',
  width: 1299,
  height: 1512,
  url: '/sites/default/files/2020-08/Raab.jpg',
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
