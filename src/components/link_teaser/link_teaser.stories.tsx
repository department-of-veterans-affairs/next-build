import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { LinkTeaser } from './index'

export default {
  title: 'Paragraphs/LinkTeaser',
  component: LinkTeaser,
} as ComponentMeta<typeof LinkTeaser>

const Template: ComponentStory<typeof LinkTeaser> = (args) => (
  <ul className="usa-unstyled-list">
    <LinkTeaser componentParams {...args} />
  </ul>
)

export const Example = Template.bind({})
Example.args = {
  id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
  title: 'Health Care Benefits Eligibility',
  options: [],
  summary:
    'Not sure if you qualify? Find out if you can get VA health care benefits.',
  uri: '/health-care/eligibility/',
  thumbnail: 'https://www.va.gov/img/arrow-right-blue.svg',
  parentField: 'field_va_paragraphs',
  componentParams: {
    boldTitle: false,
    sectionHeader: '',
  },
  type: 'paragraph--link_teaser',
}

export const Example2 = Template.bind({})
Example2.args = {
  id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
  title: 'Health Care Benefits Eligibility',
  options: [],
  summary:
    'Not sure if you qualify? Find out if you can get VA health care benefits.',
  uri: '/health-care/eligibility/',
  thumbnail: 'https://www.va.gov/img/arrow-right-blue.svg',
  parentField: 'field_spokes',
  componentParams: {
    boldTitle: true,
    sectionHeader: 'this is a section header',
  },
  type: 'paragraph--link_teaser',
}
