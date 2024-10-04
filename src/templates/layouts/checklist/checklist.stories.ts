import { Meta, StoryObj } from '@storybook/react'

import { Checklist } from './index'

const meta: Meta<typeof Checklist> = {
  title: 'Uncategorized/Checklist',
  component: Checklist,
}
export default meta

type Story = StoryObj<typeof Checklist>

export const Example: Story = {
  args: {
    title: 'Hello World!'
  },
}
