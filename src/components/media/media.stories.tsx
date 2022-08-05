import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { MediaImageComponent } from './index'
import { mediaImageDataService } from './dataService'
import mediaImage from './media_example.json'

const image = mediaImageDataService(mediaImage)

export default {
  title: 'Common/Media Image',
  component: MediaImageComponent,
} as ComponentMeta<typeof MediaImageComponent>

const Template: ComponentStory<typeof MediaImageComponent> = (args) => (
  <MediaImageComponent {...args} />
)

export const FullContentWidth = Template.bind({})
FullContentWidth.args = {
  image,
  imageStyle: 'full_content_width',
}

export const SevenTwoMediumThumbnail = Template.bind({})
SevenTwoMediumThumbnail.args = {
  image,
  imageStyle: '7_2_medium_thumbnail',
}

export const TwoOneLarge = Template.bind({})
TwoOneLarge.args = {
  image,
  imageStyle: '2_1_large',
}
