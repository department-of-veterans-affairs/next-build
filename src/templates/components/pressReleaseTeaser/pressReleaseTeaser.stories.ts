import { Meta, StoryObj } from '@storybook/react'

import { PressReleaseTeaser } from './index'

const meta: Meta<typeof PressReleaseTeaser> = {
  title: 'Uncategorized/PressReleaseTeaser',
  component: PressReleaseTeaser,
}
export default meta

type Story = StoryObj<typeof PressReleaseTeaser>

export const Example: Story = {
  args: {
    title: 'Hello World!'
  },
}
