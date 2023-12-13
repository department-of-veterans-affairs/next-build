import { Meta, StoryObj } from '@storybook/react'

import { Button } from './index'

const meta: Meta<typeof Button> = {
  title: 'Paragraphs/Button',
  component: Button,
}
export default meta

type Story = StoryObj<typeof Button>

export const Example: Story = {
  args: {
    id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
    label: 'Sign in now',
    url: 'https://www.va.gov/?next=sign-in-faq',
  },
}
