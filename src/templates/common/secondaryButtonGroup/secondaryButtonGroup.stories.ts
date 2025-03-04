import { Meta, StoryObj } from '@storybook/react'

import { SecondaryButtonGroup } from '.'

const meta: Meta<typeof SecondaryButtonGroup> = {
  title: 'Common/Secondary Button Group',
  component: SecondaryButtonGroup,
}
export default meta

type Story = StoryObj<typeof SecondaryButtonGroup>

export const Example: Story = {
  args: {
    buttons: [
      {
        id: '1',
        type: 'paragraph--button',
        url: 'https://www.va.gov/careers-employment/vocational-rehabilitation/eligibility',
        label: 'See eligibility for VR&E benefits',
      },
      {
        id: '2',
        type: 'paragraph--button',
        url: 'https://www.va.gov/careers-employment/vocational-rehabilitation/how-to-apply',
        label: 'Find out how to apply for VR&E benefits',
      },
    ],
  },
}
