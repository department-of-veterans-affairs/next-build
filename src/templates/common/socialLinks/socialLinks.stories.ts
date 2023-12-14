import { Meta, StoryObj } from '@storybook/react'

import { SocialLinks } from '.'

const meta: Meta<typeof SocialLinks> = {
  title: 'Common/Social Links',
  component: SocialLinks,
}
export default meta

type Story = StoryObj<typeof SocialLinks>

export const Example: Story = {
  args: {
    path: 'https://va-gov-cms.ddev.site/facility-name/stories/a-random-story',
    title: 'A page title to be shared',
  },
}
