import { Meta, StoryObj } from '@storybook/react'

import { PreviewCrumb } from './index'

const meta: Meta<typeof PreviewCrumb> = {
  title: 'Common/Preview',
  component: PreviewCrumb,
}
export default meta

type Story = StoryObj<typeof PreviewCrumb>

export const PreviewBreadcrumbLink: Story = {
  args: {
    entityId: 500,
  },
}
