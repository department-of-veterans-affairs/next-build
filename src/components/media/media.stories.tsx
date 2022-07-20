import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { MediaImageComponent } from './index'

const data = {
  media: {
    type: 'media--image',
    url: 'https://www.example.com/image.jpg',
    id: '1',
    imageStyle: 'string',
    image: {
      uri: {
        url: 'https://www.example.com/image.jpg',
      },
      resourceIdObjMeta: {
        alt: 'pension',
        height: '100',
        title: 'title',
        width: '100',
      },
      links: {
        '1_1_square_medium_thumbnail': {
          href: 'https://www.example.com/image.jpg',
          meta: {
            height: '100',
            width: '100',
          },
        },
      },
    },
  },
}

export default {
  title: 'Example/Media',
  component: MediaImageComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MediaImageComponent>

const Template: ComponentStory<typeof MediaImageComponent> = (args) => (
  <MediaImageComponent {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  image: data.media,
  imageStyle: 'full_content_width',
}
