import { Meta, StoryObj } from '@storybook/react'

import { Wysiwyg } from './index'

const meta: Meta<typeof Wysiwyg> = {
  title: 'Paragraphs/Wysiwyg',
  component: Wysiwyg,
}
export default meta

type Story = StoryObj<typeof Wysiwyg>

export const Example: Story = {
  args: {
    id: 'abc123',
    html: '<p>You may be eligible for VA disability benefits if you meet both of the requirements listed below.</p>\n<p><strong>Both of these must be true. You: </strong></p>\n<ul>\n<li>Have an illness we believe is caused by contact with Agent Orange (called a presumptive disease), <strong>and</strong></li>\n<li>Served in a location or job that put you in contact with Agent Orange (called having a presumption of contact) </li>\n</ul>\n<p>Read the full eligibility requirements for presumptive diseases and presumption of contact below.</p>',
    className: 'processed-content',
  },
}
