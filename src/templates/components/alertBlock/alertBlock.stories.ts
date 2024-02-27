import { Meta, StoryObj } from '@storybook/react'

import { AlertBlock } from './index'

const meta: Meta<typeof AlertBlock> = {
  title: 'Paragraphs/Alert',
  component: AlertBlock,
}
export default meta

type Story = StoryObj<typeof AlertBlock>

export const Default: Story = {
  args: {
    id: '6ecdbf96-2a9e-4beb-9d95-d41fced1473b',
    alertType: 'info',
    title: 'Changes based on Blue Water Navy Vietnam Veterans Act of 2019',
    content: {
      id: '1',
      type: 'paragraph--wysiwyg',
      html: "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
    },
  },
}

export const Expandable: Story = {
  args: {
    id: '6ecdbf96-2a9e-4beb-9d95-d41fced1473b',
    alertType: 'info',
    title: 'Changes based on Blue Water Navy Vietnam Veterans Act of 2019',
    content: {
      id: '2',
      type: 'paragraph--expandable_text',
      header: 'Learn how to sign in',
      text: "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
    },
  },
}
