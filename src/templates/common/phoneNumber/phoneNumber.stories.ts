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
    numberType: 'phone',
  },
}

export const SMS: Story = {
  args: {
    extension: '',
    label: 'SMS',
    number: '5877384756',
    numberType: 'sms',
  },
}

export const Fax: Story = {
  args: {
    extension: '',
    label: 'Fax',
    number: '5877384756',
    numberType: 'fax',
  },
}

export const TTY: Story = {
  args: {
    extension: '',
    label: 'TTY',
    number: '2736456752',
    numberType: 'tty',
  },
}
