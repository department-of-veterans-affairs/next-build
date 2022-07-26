import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Image from './index'

export default {
  title: 'Components/Image',
  component: Image,
} as ComponentMeta<typeof Image>

const Template: ComponentStory<typeof Image> = (args) => <Image {...args} />

export const Example = Template.bind({})
Example.args = {
  src: 'http://placekitten.com/200/300',
  alt: 'an example image',
  title: 'The grayest box of them all',
  height: '300',
  width: '200',
}
