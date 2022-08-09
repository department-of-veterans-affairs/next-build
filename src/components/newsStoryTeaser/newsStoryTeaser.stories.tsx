import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { NewsStoryTeaser } from '@/components/newsStoryTeaser'
import mediaImage from '../media/mockMedia.json'
import { mediaImageDataService } from '@/components/media/dataService'

const image = mediaImageDataService(mediaImage)

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
  image: image,
}
