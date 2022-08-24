import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MediaImageComponent } from './index'
import { generalEntityDataService } from '@/data/delegators/generalEntityDataService'
import { MediaImageType } from '@/types/index'
import mediaImage from './mockMedia.json'

const { url, alt, title, width, height, link } = generalEntityDataService(
  mediaImage
) as MediaImageType

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
  link,
  imageStyle: 'full_content_width',
}

export const SevenTwoMediumThumbnail = Template.bind({})
SevenTwoMediumThumbnail.args = {
  url,
  alt,
  title,
  width,
  height,
  link,
  imageStyle: '7_2_medium_thumbnail',
}

export const TwoOneLarge = Template.bind({})
TwoOneLarge.args = {
  url,
  alt,
  title,
  width,
  height,
  link,
  imageStyle: '2_1_large',
}
