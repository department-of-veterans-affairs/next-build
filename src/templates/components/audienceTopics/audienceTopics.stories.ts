import { Meta, StoryObj } from '@storybook/react'

import { AudienceTopics } from './index'

const meta: Meta<typeof AudienceTopics> = {
  title: 'Paragraphs/AudienceTopics',
  component: AudienceTopics,
}
export default meta

type Story = StoryObj<typeof AudienceTopics>

export const Example: Story = {
  args: {
    tags: [
      {
        id: '386eb70d-696c-4af3-8986-306ce63d90de',
        href: '/resources/tag/all-veterans',
        name: 'All Veterans',
        categoryLabel: 'Topics',
      },
      {
        id: '8360523e-a4bb-4d36-851f-1c445501c8bf',
        href: '/resources/tag/payments-and-debt',
        name: 'Payments and debt',
        categoryLabel: 'Audience',
      },
    ],
  },
}
