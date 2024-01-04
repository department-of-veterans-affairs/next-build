import { Meta, StoryObj } from '@storybook/react'

import { EventListing } from './index'

const meta: Meta<typeof EventListing> = {
  title: 'Uncategorized/EventListing',
  component: EventListing,
}
export default meta

type Story = StoryObj<typeof EventListing>

export const Example: Story = {
  args: {
    title: 'Hello World!'
  },
}
