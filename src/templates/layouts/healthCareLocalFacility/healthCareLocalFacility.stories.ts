import { Meta, StoryObj } from '@storybook/react'

import { HealthCareLocalFacility } from './index'

const meta: Meta<typeof HealthCareLocalFacility> = {
  title: 'Uncategorized/HealthCareLocalFacility',
  component: HealthCareLocalFacility,
}
export default meta

type Story = StoryObj<typeof HealthCareLocalFacility>

export const Example: Story = {
  args: {
    title: 'Hello World!',
  },
}
