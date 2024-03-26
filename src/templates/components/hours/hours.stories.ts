import { Meta, StoryObj } from '@storybook/react'
import { Hours } from '.'

const meta: Meta = {
  title: 'Components/Hours',
  component: Hours,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  args: {
    allHours: [
      {
        day: 0,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: 'Closed',
      },
      {
        day: 1,
        all_day: false,
        starthours: 800,
        endhours: 1630,
        comment: '',
      },
      {
        day: 2,
        all_day: false,
        starthours: 800,
        endhours: 1630,
        comment: '',
      },
      {
        day: 3,
        all_day: false,
        starthours: 800,
        endhours: 1630,
        comment: '',
      },
      {
        day: 4,
        all_day: false,
        starthours: 800,
        endhours: 1630,
        comment: '',
      },
      {
        day: 5,
        all_day: false,
        starthours: 800,
        endhours: 1630,
        comment: '',
      },
      {
        day: 6,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: 'Closed',
      },
    ],
    headerType: 'standard',
  },
}
