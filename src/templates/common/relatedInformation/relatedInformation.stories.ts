import { Meta, StoryObj } from '@storybook/react'

import { RelatedInformation } from '.'

const meta: Meta<typeof RelatedInformation> = {
  title: 'Common/Related Information',
  component: RelatedInformation,
}
export default meta

type Story = StoryObj<typeof RelatedInformation>

export const Example: Story = {
  args: {
    relatedInformation: [
      {
        id: '1',
        type: 'paragraph--link_teaser',
        uri: 'https://va.gov/burials-memorials/eligibility',
        title: 'Eligibility for burial in a VA national cemetery',
        summary: null,
        parentField: null,
        options: [],
        componentParams: null
      },
      {
        id: '2',
        type: 'paragraph--link_teaser',
        uri: 'https://va.gov/burials-memorials/schedule-a-burial',
        title: 'Schedule a burial for a Veteran or family member',
        summary: null,
        parentField: null,
        options: [],
        componentParams: null
      }
    ]
  },
}
