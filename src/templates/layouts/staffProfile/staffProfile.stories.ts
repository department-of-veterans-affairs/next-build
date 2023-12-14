import { Meta, StoryObj } from '@storybook/react'

import { StaffProfile } from '@/templates/layouts/staffProfile'

const meta: Meta<typeof StaffProfile> = {
  title: 'Paragraphs/Staff Profile',
  component: StaffProfile,
}
export default meta

type Story = StoryObj<typeof StaffProfile>

export const Full: Story = {
  args: {
    id: '7783e76f-5aca-4d14-9f5e-fb00cc11e4da',
    name: 'Mr William Smathers',
    thumbnail: {
      url: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/2019-08/William_W_Smathers.jpg',
      alt: 'William W Smathers Headshot',
      title: 'William W Smathers',
      width: 110,
      height: 136,
      id: '',
      link: {},
    },
    linkToBio: true,
    path: 'http:va.gov',
    description: 'OEF Transition Patient Advocate',
    phone: '412-551-9651',
    email: 'william.smathers@aol.com',
  },
}

export const Slim: Story = {
  args: {
    id: '7783e76f-5aca-4d14-9f5e-fb00cc11e4da',
    name: 'Mr William Smathers',
    linkToBio: false,
    path: 'http:va.gov',
    description: 'OEF Transition Patient Advocate',
    email: 'william.smathers@aol.com',
  },
}
