import { Meta, StoryObj } from '@storybook/react'

import { CommonAndPopular } from './index'

const meta: Meta<typeof CommonAndPopular> = {
  title: 'Components/Common and Popular',
  component: CommonAndPopular,
}
export default meta

type Story = StoryObj<typeof CommonAndPopular>

export const Example: Story = {}
