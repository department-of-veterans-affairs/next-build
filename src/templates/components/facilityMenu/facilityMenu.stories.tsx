import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { FacilityMenu } from './index'

export default {
  title: 'Components/Facility Menu',
  component: FacilityMenu,
} as ComponentMeta<typeof FacilityMenu>

const Template: ComponentStory<typeof FacilityMenu> = (args) => (
  <FacilityMenu {...args} />
)

export const Example = Template.bind({})
Example.args = {
  items: [
    {
      id: '386eb70d-696c-4af3-8986-306ce63d90de',
      url: '/resources/tag/all-veterans',
      label: 'All Veterans',
      enabled: true,
      expanded: false,
      weight: -65,
    },
    {
      id: '8360523e-a4bb-4d36-851f-1c445501c8bf',
      url: '/resources/tag/payments-and-debt',
      label: 'Payments and debt',
      enabled: true,
      expanded: false,
      weight: -50,
    },
  ],
}
