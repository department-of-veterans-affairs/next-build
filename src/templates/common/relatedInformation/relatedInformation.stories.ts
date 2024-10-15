import { Meta, StoryObj } from '@storybook/react'
import { RelatedInformation } from './index'

const meta: Meta<typeof RelatedInformation> = {
  title: 'Components/Related Information',
  component: RelatedInformation,
}

export default meta

type Story = StoryObj<typeof RelatedInformation>

export const Example: Story = {
  args: [
    {
      type: 'paragraph--link_teaser',
      id: '1',
      uri: 'https://www.va.gov',
      title: 'See all benefits',
      summary: 'Here is a summary of this link teaser'
    }
  ]
}
