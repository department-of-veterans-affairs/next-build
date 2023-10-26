import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import Breadcrumbs from '.'

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>

const Template: ComponentStory<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs {...args} />
)

export const Default = Template.bind({})
Default.args = {
  breadcrumbs: [
    { uri: '/home', title: 'Home', options: [] },
    { uri: '/about', title: 'About', options: [] },
  ],
}

export const WithOverride = Template.bind({})
WithOverride.args = {
  breadcrumbs: [
    { uri: '/home', title: 'Home', options: [] },
    { uri: '/about', title: 'About', options: [] },
  ],
  breadcrumbsOverride: [
    { uri: '/home', title: 'Start', options: [] },
    { uri: '/about', title: 'Details', options: [] },
  ],
}
