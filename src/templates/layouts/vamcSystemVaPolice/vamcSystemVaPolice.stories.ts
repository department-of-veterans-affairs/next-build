import { Meta, StoryObj } from '@storybook/react'

import { VamcSystemVaPolice } from './index'

const meta: Meta<typeof VamcSystemVaPolice> = {
  title: 'Uncategorized/VamcSystemVaPolice',
  component: VamcSystemVaPolice,
}
export default meta

type Story = StoryObj<typeof VamcSystemVaPolice>

export const Example: Story = {
  args: {
    title: 'Hello World!'
  },
}
