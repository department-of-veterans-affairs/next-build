import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ExpandableText } from './index'

export default {
  title: 'Paragraphs/ExpandableText',
  component: ExpandableText,
} as ComponentMeta<typeof ExpandableText>

const Template: ComponentStory<typeof ExpandableText> = (args) => (
  <ExpandableText {...args} />
)

export const Example = Template.bind({})
Example.args = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  header: 'Learn more about the changes to this program',
  text: "<p>As part of the Isakson and Roe Act of 2020, we’re expanding the VET TEC program to help more people get high-tech training from experts.</p>\\n\\n<p><strong>Here’s what’s changing:</strong></p>\\n\\n<ul><li><strong>We’re expanding access to include service members who are close to their separation date.</strong> If you're a service member, you can apply if you're within 180 days of separating from the military.</li>\\n\\t<li><strong>We’re making it easier for you to find expert instructors.</strong> You ...",
}
