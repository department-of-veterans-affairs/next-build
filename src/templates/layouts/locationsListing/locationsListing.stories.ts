import { Meta, StoryObj } from '@storybook/react'

import { LocationsListing } from './index'

const meta: Meta<typeof LocationsListing> = {
  title: 'Uncategorized/LocationsListing',
  component: LocationsListing,
}
export default meta

type Story = StoryObj<typeof LocationsListing>

export const Example: Story = {
  args: {
    title: 'Hello World!',
  },
}
