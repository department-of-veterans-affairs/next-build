import { Meta, StoryObj } from '@storybook/react'
import { ImageAndStaticMap } from '.'

const meta: Meta = {
  title: 'Components/ImageAndStaticMap',
  component: ImageAndStaticMap,
}
export default meta

type Story = StoryObj<typeof ImageAndStaticMap>

export const Default: Story = {
  args: {
    image: {
      id: 'unique-image-id',
      alt: 'Alt text for the image',
      title: 'Title of the image',
      width: 600,
      height: 300,
      links: {
        '2_1_large': {
          href: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2020-08/Raab.jpg?h=d3381009',
          meta: {
            linkParams: {
              width: 100,
              height: 100,
            },
          },
        },
      },
    },
    facilityId: 'vc_0103V',
  },
}
