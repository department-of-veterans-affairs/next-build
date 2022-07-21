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
  title: 'Components/Media',
  component: MediaImageComponent,
} as ComponentMeta<typeof MediaImageComponent>

const Template: ComponentStory<typeof MediaImageComponent> = (args) => (
  <MediaImageComponent {...args} />
)

export const FullContentWidth = Template.bind({})
FullContentWidth.args = {
  image: data.media,
  imageStyle: 'full_content_width',
}
