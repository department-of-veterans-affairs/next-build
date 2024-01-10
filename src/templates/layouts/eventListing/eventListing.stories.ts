import { Meta, StoryObj } from '@storybook/react'
import { EventListing } from './index'

const meta: Meta<typeof EventListing> = {
  title: 'Layouts/Event Listing',
  component: EventListing,
}
export default meta

type Story = StoryObj<typeof EventListing>

export const Example: Story = {
  args: {
    id: '1',
    title: 'Events',
    introText:
      'Learn more about upcoming events at the VA Butler Healthcare System, including our weekly and monthly fitness classes, support groups, and more.',
  },
}
