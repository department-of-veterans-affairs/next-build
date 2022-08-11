import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { AudienceTopics } from './index'

export default {
  title: 'Paragraphs/AudienceTopics',
  component: AudienceTopics,
} as ComponentMeta<typeof AudienceTopics>

const Template: ComponentStory<typeof AudienceTopics> = (args) => (
  <AudienceTopics {...args} />
)

export const Example = Template.bind({})
Example.args = {
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
}
