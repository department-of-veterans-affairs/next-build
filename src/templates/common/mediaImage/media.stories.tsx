import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MediaImage } from './index'
import { MediaImageType } from '@/types/index'
import data from './mockMedia.json'

export default {
  title: 'Common/Media Image',
  component: MediaImage,
} as ComponentMeta<typeof MediaImage>

const Template: ComponentStory<typeof MediaImage> = (args) => (
  <MediaImage {...args} />
)

export const FullContentWidth = Template.bind({})
FullContentWidth.args = {
  ...data[0],
  imageStyle: 'full_content_width',
}

export const SevenTwoMediumThumbnail = Template.bind({})
SevenTwoMediumThumbnail.args = {
  ...data[0],
  imageStyle: '7_2_medium_thumbnail',
}

export const TwoOneLarge = Template.bind({})
TwoOneLarge.args = {
  ...data[0],
  imageStyle: '2_1_large',
}
