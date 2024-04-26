import { Meta, StoryObj } from '@storybook/react'
import data from '@/mocks/pressRelease.mock.json'
import { PressRelease } from './index'
import { queries } from '@/data/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const meta: Meta<typeof PressRelease> = {
  title: 'Layouts/Press Release',
  component: PressRelease,
}
export default meta

const formattedData = queries.formatData(RESOURCE_TYPES.PRESS_RELEASE, data)
console.log(formattedData)
type Story = StoryObj<typeof PressRelease>


export const Example: Story = {
  args: {

  },
}


