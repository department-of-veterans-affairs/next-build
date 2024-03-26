import { Meta, StoryObj } from '@storybook/react'

import { QaSection } from './index'

const meta: Meta<typeof QaSection> = {
  title: 'Paragraphs/QaSection',
  component: QaSection,
}
export default meta

type Story = StoryObj<typeof QaSection>

export const Accordion: Story = {
  args: {
    header: 'Accordion test header',
    intro: 'intro text',
    displayAccordion: true,
    questions: [
      {
        id: '1111-1111-1111',
        question: 'Question 1',
        answers: [
          {
            id: '1',
            html: '<p>Accordion test string 1</p>',
            type: 'paragraph--wysiwyg',
          },
          {
            id: '2',
            html: '<p>Accordion test string 2</p>',
            type: 'paragraph--wysiwyg',
          },
        ],
        type: 'paragraph--q_a',
      },
    ],
  },
}

export const Other: Story = {
  args: {
    header: 'Other test Header',
    intro: 'intro text',
    displayAccordion: false,
    questions: [
      {
        id: '1111-1111-1111',
        question: 'Question 1',
        answers: [
          {
            id: '1',
            html: '<p>wysiwyg test string 1</p>',
            type: 'paragraph--wysiwyg',
          },
        ],
        type: 'paragraph--q_a',
      },
    ],
  },
}
