import { render, screen } from '@testing-library/react'
import { PressRelease } from './index'

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
  fullText: {
    processed: '<p>We invite you to come and read our 2019 Annual Report. </p>',
    value: '<p>We invite you to come and read our 2019 Annual Report.<em> </em></p>\r\n',
    format: 'rich_text',
  },
  contacts: [],
  downloads: [],
  office: undefined,
}
describe('PressRelease with valid data', () => {
  test('renders PressRelease component', () => {
    render(
      <PressRelease {...data} />
    )
    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})
