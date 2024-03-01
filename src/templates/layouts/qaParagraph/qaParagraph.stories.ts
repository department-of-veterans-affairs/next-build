// QaParagraph.stories.tsx
import { Meta, StoryObj } from '@storybook/react'
import { QaParagraph } from './'
import { QaParagraph as FormattedQaParagraph } from '@/types/formatted/qaParagraph'

const meta: Meta<typeof QaParagraph> = {
  title: 'Components/QA Paragraph',
  component: QaParagraph,
}
export default meta

type Story = StoryObj<typeof QaParagraph>

export const Default: Story = {
  args: {
    question: 'Sample question?',
    answers: [
      {
        id: '1',
        html: '<p>test string 1</p>',
        type: 'paragraph--wysiwyg',
      },
      {
        id: '2',
        html: '<p>test string 2</p>',
        type: 'paragraph--wysiwyg',
      },
    ],
  },
}
