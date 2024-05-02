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
  title: 'Minneapolis health care Placeholder - News release',
  id: '18311',
  type: 'node--press_release',
  published: false,
  lastUpdated: '',
  releaseDate: '2020-06-19T10:25:28-04:00',
  pdfVersion: undefined,
  introText:
    'Virtual Town Hall Discusses COVID-19 Vaccine Hesitancy for BIPOC Veterans WEBEX Event Wednesday, April 28',
  address: {
    langcode: null,
    country_code: 'US',
    administrative_area: 'TX',
    locality: 'Houston',
    address_line1: '',
    address_line2: '',
  },
  fullText: '<p>Houston health care Placeholder - News release</p>',
  contacts: [],
  downloads: [],
}

export const Example: Story = {
  args: {
    ...data,
  },
}
