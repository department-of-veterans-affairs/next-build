import { Meta, StoryObj } from '@storybook/react'

import { ProcessList } from './index'

const meta: Meta<typeof ProcessList> = {
  title: 'Paragraphs/ProcessList',
  component: ProcessList,
}
export default meta

type Story = StoryObj

export const Example: Story = {
  args: {
    steps: [{ html: `<p>test step 1</p>` }, { html: `<p>test step 2</p>` }],
    entityId: 1,
  },
}
