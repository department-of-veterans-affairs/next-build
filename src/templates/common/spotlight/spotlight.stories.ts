import { Meta, StoryObj } from '@storybook/react'

import { Spotlight } from './index'

const meta: Meta<typeof Spotlight> = {
  title: 'Uncategorized/Spotlight',
  component: Spotlight,
}
export default meta

type Story = StoryObj<typeof Spotlight>

export const Example: Story = {
  args: {
    title: 'Hello world',
    description: 'foo bar',
    link: {
      href: '#',
      label: 'a link',
    },
  },
}
