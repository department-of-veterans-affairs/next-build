import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { PreviewCrumb, UnpublishedBanner } from './index'

export default {
  title: 'Common/Preview',
  component: PreviewCrumb,
} as ComponentMeta<typeof PreviewCrumb>

const Template: ComponentStory<typeof PreviewCrumb> = (args) => (
  <PreviewCrumb {...args} />
)
const UnpublishedBannerTemplate: ComponentStory<typeof UnpublishedBanner> = (
  args
) => <UnpublishedBanner {...args} />

export const Example = Template.bind({})
Example.args = {
  entityId: 500,
}

export const Draft = UnpublishedBannerTemplate.bind({})
Draft.args = {
  resource: {
    published: false,
    moderationState: 'draft',
    entityPath:
      '/oklahoma-city-health-care/stories/el-reno-high-school-continues-78-year-tradition-of-giving-gifts-to-veterans',
    entityId: '500',
  },
}

export const Archived = UnpublishedBannerTemplate.bind({})
Archived.args = {
  resource: {
    published: false,
    moderationState: 'archived',
    entityPath:
      '/oklahoma-city-health-care/stories/el-reno-high-school-continues-78-year-tradition-of-giving-gifts-to-veterans',
    entityId: '500',
  },
}
