import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { MediaImageComponent } from './index'
import { mediaImageDataService } from './dataService'
import mediaImage from './mockMedia.json'

const { url, alt, title, width, height, styles } = mediaImageDataService(
  mediaImage,
  'full_content_width'
)

export default {
  title: 'Common/Media Image',
  component: MediaImageComponent,
} as ComponentMeta<typeof MediaImageComponent>

const Template: ComponentStory<typeof MediaImageComponent> = (args) => (
  <MediaImageComponent {...args} />
)

export const FullContentWidth = Template.bind({})
FullContentWidth.args = {
  url,
  alt,
  title,
  width,
  height,
  styles,
  imageStyle: 'full_content_width',
}

export const SevenTwoMediumThumbnail = Template.bind({})
SevenTwoMediumThumbnail.args = {
  url,
  alt,
  title,
  width,
  height,
  styles,
  imageStyle: '7_2_medium_thumbnail',
}

export const TwoOneLarge = Template.bind({})
TwoOneLarge.args = {
  url,
  alt,
  title,
  width,
  height,
  styles,
  imageStyle: '2_1_large',
}
