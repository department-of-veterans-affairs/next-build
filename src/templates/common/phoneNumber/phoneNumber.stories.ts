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
    type: 'paragraph--phone_number',
    id: '1234',
    extension: '1234',
    label: 'Phone',
    number: '123-456-7890',
    phoneType: 'phone',
  },
}

export const SMS: Story = {
  args: {
    type: 'paragraph--phone_number',
    id: '1234',
    extension: '',
    label: 'SMS',
    number: '5877384756',
    phoneType: 'sms',
  },
}

export const Fax: Story = {
  args: {
    type: 'paragraph--phone_number',
    id: '1234',
    extension: '',
    label: 'Fax',
    number: '5877384756',
    phoneType: 'fax',
  },
}

export const TTY: Story = {
  args: {
    type: 'paragraph--phone_number',
    id: '1234',
    extension: '',
    label: 'TTY',
    number: '2736456752',
    phoneType: 'tty',
  },
}
