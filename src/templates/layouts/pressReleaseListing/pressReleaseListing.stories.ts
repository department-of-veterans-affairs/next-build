import { Meta, StoryObj } from '@storybook/react'

import { PressReleaseListing } from './index'

const meta: Meta<typeof PressReleaseListing> = {
  title: 'Uncategorized/PressReleaseListing',
  component: PressReleaseListing,
}
export default meta

type Story = StoryObj<typeof PressReleaseListing>

export const Example: Story = {
  args: {
    title: 'Hello World!'
  },
}
