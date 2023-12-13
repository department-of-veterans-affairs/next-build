import { Meta, StoryObj } from '@storybook/react'

import { EmailContact } from '@/templates/components/emailContact/index'

const meta: Meta<typeof EmailContact> = {
  title: 'Paragraphs/EmailContact',
  component: EmailContact,
}
export default meta

type Story = StoryObj<typeof EmailContact>

export const Example: Story = {
  args: {
    id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
    label: 'Minority Veterans Program',
    address: 'joe.veteran@va.gov',
  },
}
