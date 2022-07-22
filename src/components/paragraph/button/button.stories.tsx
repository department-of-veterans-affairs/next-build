import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Button } from './index'

export default {
  title: 'Paragraphs/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Example = Template.bind({})
Example.args = {
  paragraph: {
    id: 1,
    field_button_label: 'foo',
    field_button_link: {
      uri: 'https://www.example.com',
    },
  },
}
