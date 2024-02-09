import { Meta, StoryObj } from '@storybook/react'

import { PromoBanner } from './index'

const meta: Meta<typeof PromoBanner> = {
  title: 'Common/PromoBanner',
  component: PromoBanner,
}
export default meta

type Story = StoryObj<typeof PromoBanner>

export const Example: Story = {
  args: {
    id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
    title: 'This is a promo banner',
    alertType: 'info',
    type: 'promo_banner',
    href: '#',
  },
}
