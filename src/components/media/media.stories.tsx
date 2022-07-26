import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { MediaImageComponent } from './index'
import mediaImage from './media_example.json'

export default {
  title: 'Components/Media Image',
  component: MediaImageComponent,
} as ComponentMeta<typeof MediaImageComponent>

const Template: ComponentStory<typeof MediaImageComponent> = (args) => (
  <MediaImageComponent {...args} />
)

export const FullContentWidth = Template.bind({})
FullContentWidth.args = {
  image: mediaImage,
  imageStyle: 'full_content_width',
}

export const SevenTwoMediumThumbnail = Template.bind({})
SevenTwoMediumThumbnail.args = {
  image: mediaImage,
  imageStyle: '7_2_medium_thumbnail',
}

export const TwoOneLarge = Template.bind({})
TwoOneLarge.args = {
  image: mediaImage,
  imageStyle: '2_1_large',
}
