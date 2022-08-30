import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MediaImageComponent } from './index'
import { queries } from '@/data/queries'
import { MediaImageType } from '@/types/index'
import mediaImage from './mockMedia.json'

const { id, alt, title, link } = mediaImage[0]

export default {
  title: 'Common/Media Image',
  component: MediaImageComponent,
} as ComponentMeta<typeof MediaImageComponent>

const Template: ComponentStory<typeof MediaImageComponent> = (args) => (
  <MediaImageComponent {...args} />
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
