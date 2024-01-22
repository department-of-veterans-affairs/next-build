import { Meta, StoryObj } from '@storybook/react'

import { StoryListing } from './index'
import data from '@/mocks/storyListing.mock.json'
import { formattedStories } from '@/mocks/formattedNewsStories.mock'

const meta: Meta<typeof StoryListing> = {
  title: 'Layouts/Story Listing',
  component: StoryListing,
}
export default meta

type Story = StoryObj<typeof StoryListing>

export const NoStories: Story = {
  args: {
    ...data,
  },
}

export const List: Story = {
  args: {
    ...data,
    stories: formattedStories,
  },
}
