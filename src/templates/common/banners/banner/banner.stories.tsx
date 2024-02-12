import { Meta, StoryObj } from '@storybook/react'

import { Banner } from './index'

const meta: Meta<typeof Banner> = {
  title: 'Common/Banner',
  component: Banner,
}
export default meta

type Story = StoryObj<typeof Banner>

export const Example: Story = {
  args: {
    id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
    title: 'This is an informational banner',
    body: 'Here is important content you need to know.',
    dismiss: false,
    alertType: 'info',
    type: 'banner',
  },
}
