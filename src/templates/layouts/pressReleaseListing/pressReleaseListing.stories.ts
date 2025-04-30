import { Meta, StoryObj } from '@storybook/react'

import { PressReleaseListing } from './index'
import data from '@/mocks/pressReleaseListing.mock.json'
import { formattedPressReleases } from '@/mocks/formattedPressReleases.mock'

const meta: Meta<typeof PressReleaseListing> = {
  title: 'Layouts/Press Release Listing',
  component: PressReleaseListing,
}
export default meta

type Story = StoryObj<typeof PressReleaseListing>

export const NoPressReleases: Story = {
  args: {
    ...data,
  },
}

export const List: Story = {
  args: {
    ...data,
    'news-releases': formattedPressReleases,
  },
}
