import { Meta, StoryObj } from '@storybook/react'

import { QaCollapsiblePanel } from './index'

const meta: Meta<typeof QaCollapsiblePanel> = {
  title: 'Paragraphs/QaCollapsiblePanel',
  component: QaCollapsiblePanel,
}
export default meta

type Story = StoryObj<typeof QaCollapsiblePanel>

export const Example: Story = {
  args: {
    questions: [
      {
        id: '1111-1111-1111',
        question: 'Question 1',
        answers: [
          {
            id: '1',
            html: '<p>test string 1</p>',
            type: 'paragraph--wysiwyg',
          },
          {
            id: '2',
            html: '<p> test string 2</p>',
            type: 'paragraph--wysiwyg',
          },
        ],
        type: 'paragraph--q_a',
      },
    ],
  },
}
