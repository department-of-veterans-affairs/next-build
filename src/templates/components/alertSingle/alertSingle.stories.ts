import { Meta, StoryObj } from '@storybook/react'
import { AlertSingle } from './'
import { Alert } from '@/types/formatted/alert'

const meta: Meta<typeof AlertSingle> = {
  title: 'Paragraphs/AlertSingle',
  component: AlertSingle,
}
export default meta

type Story = StoryObj<typeof AlertSingle>

const blockReference: Alert = {
  id: '6ecdbf96-2a9e-4beb-9d95-d41fced1473b',
  alertType: 'information',
  title: 'Block Reference Title',
  content: {
    header: 'Block Reference Header',
    text: '<p>This is the block reference content.</p>',
  },
}

const nonReusableRef: Alert = {
  id: '7fced1473b-2a9e-4beb-9d95-6ecdbf96',
  alertType: 'warning',
  title: 'Non-Reusable Reference Title',
  content: {
    header: 'Non-Reusable Reference Header',
    text: '<p>This is the non-reusable reference content.</p>',
  },
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
