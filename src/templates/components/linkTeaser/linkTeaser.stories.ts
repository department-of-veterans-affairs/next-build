import { Meta, StoryObj } from '@storybook/react'
import { LinkTeaser } from './index'

const meta: Meta<typeof LinkTeaser> = {
  title: 'Paragraphs/Link Teaser',
  component: LinkTeaser,
}
export default meta

type Story = StoryObj<typeof LinkTeaser>

export const Default: Story = {
  args: {
    id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
    title: 'Health Care Benefits Eligibility',
    options: [],
    summary:
      'Not sure if you qualify? Find out if you can get VA health care benefits.',
    uri: '/health-care/eligibility/',
    parentField: 'field_va_paragraphs',
    componentParams: {
      boldTitle: false,
      sectionHeader: '',
    },
  },
}

export const WithIcon: Story = {
  args: {
    id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
    title: 'Health Care Benefits Eligibility',
    options: [],
    summary:
      'Not sure if you qualify? Find out if you can get VA health care benefits.',
    uri: '/health-care/eligibility/',
    parentField: 'field_spokes',
    componentParams: {
      boldTitle: true,
      sectionHeader: 'this is a section header',
    },
  },
}
