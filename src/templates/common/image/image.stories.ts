import { Meta, StoryObj } from '@storybook/react'
import Image from './index'

const meta: Meta<typeof Image> = {
  title: 'Common/Image',
  component: Image,
}
export default meta

type Story = StoryObj<typeof Image>

export const Example: Story = {
  args: {
    src: 'http://placekitten.com/200/300',
    alt: 'an example image',
    title: 'A cute kitten.',
    height: '300',
    width: '200',
  },
}
