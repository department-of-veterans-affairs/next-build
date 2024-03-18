import { Meta, StoryObj } from '@storybook/react'
import { NumberCallout } from './index'

const meta: Meta<typeof NumberCallout> = {
  title: 'Paragraphs/NumberCallout',
  component: NumberCallout,
}
export default meta

type Story = StoryObj<typeof NumberCallout>

export const Default: Story = {
  args: {
    numberPhrase: '1234',
    description: 'Test description',
    entityId: 1,
  },
}
