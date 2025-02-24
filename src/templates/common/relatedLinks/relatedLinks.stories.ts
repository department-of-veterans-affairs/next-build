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
    sectionTitle: 'VA benefits',
    links: [
      {
        uri: 'https://va.gov/burials-memorials/eligibility',
        title: 'Eligibility for burial in a VA national cemetery',
        summary:
          'Here is a summary for this URL so you can see how it displays underneath.',
      },
      {
        uri: 'https://va.gov/burials-memorials/schedule-a-burial',
        title: 'Schedule a burial for a Veteran or family member',
        summary: null,
      },
    ],
  },
}
