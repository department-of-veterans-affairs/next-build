import { Meta, StoryObj } from '@storybook/react'
import { SecondaryButtonGroup } from './index'

const meta: Meta<typeof SecondaryButtonGroup> = {
  title: 'Components/Secondary Button Group',
  component: SecondaryButtonGroup,
}

export default meta

type Story = StoryObj<typeof SecondaryButtonGroup>

export const Example: Story = {
  args: [
    {
      type: 'paragraph--button',
      id: '1',
      url: 'https://www.va.gov',
      label: 'See all benefits'
    }
  ]
}
