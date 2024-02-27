import { Meta, StoryObj } from '@storybook/react'
import { AlertSingle } from './'
import { Alert, AlertBlock, AlertNonReusable } from '@/types/formatted/alert'

const meta: Meta<typeof AlertSingle> = {
  title: 'Paragraphs/AlertSingle',
  component: AlertSingle,
}
export default meta

type Story = StoryObj<typeof AlertSingle>

const blockReference: AlertBlock = {
  id: '6ecdbf96-2a9e-4beb-9d95-d41fced1473b',
  alertType: 'info',
  title: 'Block Reference Title',
  content: {
    id: 'et-1',
    type: 'paragraph--expandable_text',
    header: 'Block Reference Header',
    text: '<p>This is the block reference content.</p>',
  },
}

const nonReusableRef: AlertNonReusable = {
  id: '7fced1473b-2a9e-4beb-9d95-6ecdbf96',
  type: 'paragraph--non_reusable_alert',
  alertType: 'warning',
  heading: 'Non-Reusable Reference Title',
  paragraphs: [
    {
      id: 'w-01',
      type: 'paragraph--wysiwyg',
      html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
    },
  ],
}

export const ReusableAlert: Story = {
  args: {
    alertSelection: 'R',
    blockReference: blockReference,
    nonReusableRef: nonReusableRef,
  },
}

export const NonReusableAlert: Story = {
  args: {
    alertSelection: 'NR',
    blockReference: blockReference,
    nonReusableRef: nonReusableRef,
  },
}
