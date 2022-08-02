import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from './index'

export default {
  title: 'Paragraphs/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Example = Template.bind({})
Example.args = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  label: 'Sign in now',
  url: 'https://www.va.gov/?next=sign-in-faq',
}
