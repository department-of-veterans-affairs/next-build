import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MediaImage } from './index'
import { queries } from '@/data/queries'
import { MediaImageType } from '@/types/index'
import mediaImageData from './mockMedia.json'

const { id, alt, title, link } = mediaImageData[0]

console.log(mediaImageData)

export default {
  title: 'Common/Media Image',
  component: MediaImage,
} as ComponentMeta<typeof MediaImage>

const Template: ComponentStory<typeof MediaImage> = (args) => (
  <MediaImage {...args} />
)

export const FullContentWidth = Template.bind({})
FullContentWidth.args = {
  id,
  alt,
  title,
  link,
  imageStyle: 'full_content_width',
}

export const SevenTwoMediumThumbnail = Template.bind({})
SevenTwoMediumThumbnail.args = {
  id,
  alt,
  title,
  link,
  imageStyle: '7_2_medium_thumbnail',
}

export const TwoOneLarge = Template.bind({})
TwoOneLarge.args = {
  id,
  alt,
  title,
  link,
  imageStyle: '2_1_large',
}
