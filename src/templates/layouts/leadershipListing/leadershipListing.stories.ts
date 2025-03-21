import { Meta, StoryObj } from '@storybook/react'

import { LeadershipListing } from './index'

const meta: Meta<typeof LeadershipListing> = {
  title: 'Uncategorized/LeadershipListing',
  component: LeadershipListing,
}
export default meta

type Story = StoryObj<typeof LeadershipListing>

export const Example: Story = {
  args: {
    title: 'Hello World!'
  },
}
