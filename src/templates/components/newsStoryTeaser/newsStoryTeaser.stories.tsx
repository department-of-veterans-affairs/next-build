import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
import { MediaImageType } from '@/types/index'

const mediaImage: MediaImageType = {
  id: '1',
  alt: 'Dr. Brooke Decker ',
  title: 'test',
  url: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
  width: 23,
  height: 23,
  link: [
    {
      href: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
      width: 23,
      height: 23,
    },
  ],
  imageStyle: '1_1_square_medium_thumbnail',
  className: 'test',
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
