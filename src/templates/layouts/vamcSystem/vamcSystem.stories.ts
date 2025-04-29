import { Meta, StoryObj } from '@storybook/react'

import { VamcSystem } from './index'

const meta: Meta<typeof VamcSystem> = {
  title: 'Uncategorized/VamcSystem',
  component: VamcSystem,
}
export default meta

type Story = StoryObj<typeof VamcSystem>

export const Example: Story = {
  args: {
    title: 'Hello World!'
  },
}
