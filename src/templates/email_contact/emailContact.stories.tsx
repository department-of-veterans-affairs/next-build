import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { EmailContact } from 'templates/email_contact/index'

export default {
  title: 'Paragraphs/EmailContact',
  component: EmailContact,
} as ComponentMeta<typeof EmailContact>

const Template: ComponentStory<typeof EmailContact> = (args) => (
  <EmailContact {...args} />
)

export const Example = Template.bind({})
Example.args = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  label: 'Minority Veterans Program',
  address: 'joe.veteran@va.gov',
}
