import { Meta, StoryObj } from '@storybook/react'

import { PressReleaseTeaser } from './index'

const meta: Meta<typeof PressReleaseTeaser> = {
  title: 'Components/Press Release Teaser',
  component: PressReleaseTeaser,
}
export default meta

type Story = StoryObj<typeof PressReleaseTeaser>

export const Example: Story = {
  args: {
    headingLevel: 'h2',
    title: 'Wilmington VAMC 2019 Annual Report',
    introText:
      'When a hospital has a host of great doctors, honoring just two every year is challenging.',
    link: '/wilmington-health-care/news-releases/wilmington-vamc-2019-annual-report'
  },
}
