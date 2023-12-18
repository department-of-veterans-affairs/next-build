import { Meta, StoryObj } from '@storybook/react'

import { UnpublishedBanner } from './index'

const meta: Meta<typeof UnpublishedBanner> = {
  title: 'Common/Preview',
  component: UnpublishedBanner,
}
export default meta

type Story = StoryObj<typeof UnpublishedBanner>

export const Draft: Story = {
  args: {
    resource: {
      published: false,
      moderationState: 'draft',
      entityPath:
        '/oklahoma-city-health-care/stories/el-reno-high-school-continues-78-year-tradition-of-giving-gifts-to-veterans',
      entityId: '500',
    },
  },
}

export const Archived: Story = {
  args: {
    resource: {
      published: false,
      moderationState: 'archived',
      entityPath:
        '/oklahoma-city-health-care/stories/el-reno-high-school-continues-78-year-tradition-of-giving-gifts-to-veterans',
      entityId: '500',
    },
  },
}
