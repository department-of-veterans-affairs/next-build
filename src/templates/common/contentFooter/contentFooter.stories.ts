import { Meta, StoryObj } from '@storybook/react'

import { ContentFooter } from './index'

const meta: Meta<typeof ContentFooter> = {
  title: 'Common/ContentFooter',
  component: ContentFooter,
}
export default meta

type Story = StoryObj<typeof ContentFooter>

export const Default: Story = {}

export const ISOString: Story = {
  args: {
    lastUpdated: '2022-10-12T20:00:51-0400',
  },
}

export const Milliseconds: Story = {
  args: {
    lastUpdated: 1665619251000,
  },
}

export const Seconds: Story = {
  args: {
    lastUpdated: 1665619251,
  },
}
