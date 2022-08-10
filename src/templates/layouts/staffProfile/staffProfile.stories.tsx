import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { StaffProfile } from '@/templates/layouts/staffProfile'

export default {
  title: 'Paragraphs/Staff Profile',
  component: StaffProfile,
} as ComponentMeta<typeof StaffProfile>

const Template: ComponentStory<typeof StaffProfile> = (args) => (
  <StaffProfile {...args} />
)

export const Full = Template.bind({})
Full.args = {
  id: '7783e76f-5aca-4d14-9f5e-fb00cc11e4da',
  name: 'Mr William Smathers',
  thumbnail: {
    url: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/2019-08/William_W_Smathers.jpg',
    alt: 'William W Smathers Headshot',
    title: 'William W Smathers',
    width: 110,
    height: 136,
    styles: {},
  },
  linkToBio: true,
  path: 'http:va.gov',
  description: 'OEF Transition Patient Advocate',
  phone: '412-551-9651',
  email: 'william.smathers@aol.com',
}

export const Slim = Template.bind({})
Slim.args = {
  id: '7783e76f-5aca-4d14-9f5e-fb00cc11e4da',
  name: 'Mr William Smathers',
  linkToBio: false,
  path: 'http:va.gov',
  description: 'OEF Transition Patient Advocate',
  email: 'william.smathers@aol.com',
}
