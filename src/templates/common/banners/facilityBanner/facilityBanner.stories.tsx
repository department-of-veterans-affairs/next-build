import { Meta, StoryObj } from '@storybook/react'

import { FacilityBanner } from './index'

const meta: Meta<typeof FacilityBanner> = {
  title: 'Common/Facility Banner',
  component: FacilityBanner,
}
export default meta

type Story = StoryObj<typeof FacilityBanner>

export const Example: Story = {
  args: {
    id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
    title: 'This is an informational banner',
    body: 'Here is important content you need to know.',
    dismiss: false,
    type: 'full_width_banner_alert',
  },
}
