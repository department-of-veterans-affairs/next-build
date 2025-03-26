import { Meta, StoryObj } from '@storybook/react'
import { LeadershipListing } from '.'
import data from './storybook-data'

const meta: Meta<typeof LeadershipListing> = {
  title: 'Layouts/Leadership Listing',
  component: LeadershipListing,
}

export default meta

type Story = StoryObj<typeof LeadershipListing>

export const Default: Story = {
  args: data
}
