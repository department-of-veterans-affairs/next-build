import { Meta, StoryObj } from '@storybook/react'
//import data from '@/mocks/pressRelease.mock.json'
import { PressRelease } from './index'

const meta: Meta<typeof PressRelease> = {
  title: 'Layouts/Press Release',
  component: PressRelease,
}
export default meta

type Story = StoryObj<typeof PressRelease>

const data = {
  title: 'Wilmington VAMC 2019 Annual Report',
  id: '398575',
  type: 'node--press_release',
  published: false,
  lastUpdated: '',
  releaseDate: '2020-06-19T10:25:28-04:00',
  pdfVersion: undefined,
  introText: 'We invite you to come and read our 2019 Annual Report. ',
  address:{
    langcode: 'en',
    country_code: 'US',
    administrative_area: 'DE',
    locality: 'Wilimington',
    address_line1: '',
    address_line2: '',
  },
  fullText: '<p>We invite you to come and read our 2019 Annual Report. </p>',
  contacts: [],
  downloads: [],
}


export const Example: Story = {
  args: {
    ...data,
  },
}


