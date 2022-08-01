import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { StaffProfile } from '@/components/staffProfile'
import mediaImage from '@/components/media/media_example.json'
import { mediaImageDataService } from '@/components/media/dataService'

const image = mediaImageDataService(mediaImage)

export default {
  title: 'Paragraphs/Staff Profile',
  component: StaffProfile,
} as ComponentMeta<typeof StaffProfile>

const Template: ComponentStory<typeof StaffProfile> = (args) => (
  <StaffProfile {...args} />
)

export const Full = Template.bind({})
Full.args = {
  id: '1',
  name: 'Dr. Brooke Decker',
  thumbnail: image,
  linkToBio: true,
  path: '#',
  description: 'foo',
  phone: '503-867-5309',
  email: 'brooke.decker@va.gov',
}

export const Slim = Template.bind({})
Slim.args = {
  id: '1',
  name: 'Dr. Brooke Decker',
  linkToBio: false,
  path: '#',
}
