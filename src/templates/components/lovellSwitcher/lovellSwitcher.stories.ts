import { Meta, StoryObj } from '@storybook/react'

import { LovellSwitcher } from './index'
import { LOVELL } from '@/lib/drupal/lovell/constants'

const meta: Meta<typeof LovellSwitcher> = {
  title: 'Components/LovellSwitcher',
  component: LovellSwitcher,
}
export default meta

type Story = StoryObj<typeof LovellSwitcher>

export const TricareToVa: Story = {
  args: {
    currentVariant: LOVELL.tricare.variant,
    switchPath: '/?path=/story/components-lovellswitcher--va-to-tricare',
  },
}

export const VaToTricare: Story = {
  args: {
    currentVariant: LOVELL.va.variant,
    switchPath: '/?path=/story/components-lovellswitcher--tricare-to-va',
  },
}
