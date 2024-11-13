import { Meta, StoryObj } from '@storybook/react'

import { RelatedLinks } from '.'

const meta: Meta<typeof RelatedLinks> = {
  title: 'Common/Related Links',
  component: RelatedLinks,
}
export default meta

type Story = StoryObj<typeof RelatedLinks>

export const Example: Story = {
  args: {
    links: [
      {
        url: 'https://va.gov/burials-memorials/eligibility',
        title: 'Eligibility for burial in a VA national cemetery',
        summary: null,
      },
      {
        url: 'https://va.gov/burials-memorials/schedule-a-burial',
        title: 'Schedule a burial for a Veteran or family member',
        summary: null,
      }
    ]
  },
}
