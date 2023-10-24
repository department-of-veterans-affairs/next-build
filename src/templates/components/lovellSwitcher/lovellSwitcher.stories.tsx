import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { LovellSwitcher } from './index'
import { LOVELL } from '@/lib/drupal/lovell/constants'

export default {
  title: 'Components/LovellSwitcher',
  component: LovellSwitcher,
} as ComponentMeta<typeof LovellSwitcher>

const Template: ComponentStory<typeof LovellSwitcher> = (args) => (
  <LovellSwitcher {...args} />
)

export const TricareToVa = Template.bind({})
TricareToVa.args = {
  currentVariant: LOVELL.tricare.variant,
  switchPath: '/?path=/story/components-lovellswitcher--va-to-tricare',
}

export const VaToTricare = Template.bind({})
VaToTricare.args = {
  currentVariant: LOVELL.va.variant,
  switchPath: '/?path=/story/components-lovellswitcher--tricare-to-va',
}
