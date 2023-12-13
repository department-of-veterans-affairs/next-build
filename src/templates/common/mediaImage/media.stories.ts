import { Meta, StoryObj } from '@storybook/react'
import { MediaImage } from './index'
import data from './mockMedia.json'

const meta: Meta<typeof MediaImage> = {
  title: 'Common/Media Image',
  component: MediaImage,
}
export default meta

type Story = StoryObj<typeof MediaImage>

export const FullContentWidth: Story = {
  args: {
    ...data[0],
    imageStyle: 'full_content_width',
  },
}

export const SevenTwoMediumThumbnail: Story = {
  args: {
    ...data[0],
    imageStyle: '7_2_medium_thumbnail',
  },
}

export const TwoOneLarge: Story = {
  args: {
    ...data[0],
    imageStyle: '2_1_large',
  },
}
