import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ContentFooter } from './index'

export default {
  title: 'Common/ContentFooter',
  component: ContentFooter,
} as ComponentMeta<typeof ContentFooter>

const Template: ComponentStory<typeof ContentFooter> = (args) => (
  <ContentFooter {...args} />
)

export const NoLastUpdated = Template.bind({})
NoLastUpdated.storyName = 'No lastUpdated'
NoLastUpdated.args = {}

export const ISOString = Template.bind({})
ISOString.args = {
  lastUpdated: '2022-10-12T20:00:51-0400',
}

export const Milliseconds = Template.bind({})
Milliseconds.args = {
  lastUpdated: 1665619251000,
}

export const Seconds = Template.bind({})
Seconds.args = {
  lastUpdated: 1665619251,
}
