import { Meta, StoryObj } from '@storybook/react'
import { PhoneNumber } from '.'

const meta: Meta<typeof PhoneNumber> = {
  title: 'Common/Phone Number',
  component: PhoneNumber,
}

export default meta

type Story = StoryObj<typeof PhoneNumber>

export const Standard: Story = {
  args: {
    extension: '1234',
    label: 'Phone',
    number: '123-456-7890',
    phoneType: 'phone',
  },
}

export const SMS: Story = {
  args: {
    label: 'SMS',
    number: '5877384756',
    phoneType: 'sms',
  },
}

export const Fax: Story = {
  args: {
    label: 'Fax',
    number: '5877384756',
    phoneType: 'fax',
  },
}

export const TTY: Story = {
  args: {
    label: 'TTY',
    number: '2736456752',
    phoneType: 'tty',
  },
}
