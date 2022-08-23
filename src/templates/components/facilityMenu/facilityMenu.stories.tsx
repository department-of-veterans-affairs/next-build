import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { FacilityMenu } from './index'
import MockMenu from './facilityMenu.json'

export default {
  title: 'Components/Facility Menu',
  component: FacilityMenu,
} as ComponentMeta<typeof FacilityMenu>

const Template: ComponentStory<typeof FacilityMenu> = (args) => (
  <FacilityMenu {...args} />
)

export const Example = Template.bind({})
Example.args = {
  items: MockMenu.items,
  tree: MockMenu.tree,
  depth: 0,
  maxDepth: undefined,
}

export const MaxDepth = Template.bind({})
MaxDepth.args = {
  items: MockMenu.items,
  tree: MockMenu.tree,
  depth: 0,
  maxDepth: 2,
}
