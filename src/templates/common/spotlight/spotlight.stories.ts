import { Meta, StoryObj } from '@storybook/react'

import { Spotlight } from './index'

const meta: Meta<typeof Spotlight> = {
  title: 'Paragraphs/Featured Content',
  component: Spotlight,
}
export default meta

type Story = StoryObj<typeof Spotlight>

export const Example: Story = {
  args: {
    title: 'Hello world',
    description: 'foo bar',
    link: {
      id: '1',
      url: '#',
      label: 'a link',
    },
  },
}
