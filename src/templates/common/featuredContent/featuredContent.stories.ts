import { Meta, StoryObj } from '@storybook/react'

import { FeaturedContent } from './index'

const meta: Meta<typeof FeaturedContent> = {
  title: 'Paragraphs/Featured Content',
  component: FeaturedContent,
}
export default meta

type Story = StoryObj<typeof FeaturedContent>

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
