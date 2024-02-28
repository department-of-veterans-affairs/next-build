// QaParagraph.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { QaParagraph } from './';
import { QaParagraph as FormattedQaParagraph } from "@/types/formatted/qaParagraph";

const meta: Meta<typeof QaParagraph> = {
  title: 'Components/QA Paragraph',
  component: QaParagraph,
};
export default meta;

type Story = StoryObj<typeof QaParagraph>;

export const Default: Story = {
  args: {
    id: 1,
    question: 'What is the purpose of the QA Paragraph component?',
    type: 'paragraph--wysiwyg',
    answers: [
      {
        value: '<p>test string 1</p>',
        format: 'rich_text',
        processed: '<p>test string 1</p>'
      },
      {
        value: '<p>test string 2</p>',
        format: 'rich_text',
        processed: '<p>test string 2</p>'
      }
    ],
  },
};
