import { Meta, StoryObj } from '@storybook/react'

import { StoryListing } from './index'
import data from './nodeStoryListing.json'
import { formattedStories } from './mockFormattedList'

const meta: Meta<typeof StoryListing> = {
  title: 'Layouts/Story Listing',
  component: StoryListing,
}
export default meta

type Story = StoryObj<typeof StoryListing>

export const NoStories: Story = {
  args: {
    ...data[0],
  },
}

export const List: Story = {
  args: {
    ...data[0],
    stories: formattedStories,
  },
}
