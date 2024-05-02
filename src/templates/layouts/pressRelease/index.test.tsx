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
  introText:
    'Virtual Town Hall Discusses COVID-19 Vaccine Hesitancy for BIPOC Veterans WEBEX Event Wednesday, April 28',
  address: {
    langcode: 'en',
    country_code: 'US',
    administrative_area: 'DE',
    locality: 'Wilimington',
    address_line1: '',
    address_line2: '',
  },
  fullText: '<p>Houston health care Placeholder - News release</p>',
  contacts: [],
  downloads: [],
  listing: '',
  administration: {
    id: 0,
    name: '',
  },
  office: undefined,
}

describe('<pressRelease> with valid data', () => {
  let spy: jest.SpyInstance
  beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => null)
  })
  afterEach(() => {
    spy.mockRestore()
  })
  test('renders component', () => {
    const { container } = render(<PressRelease {...data} />)
    expect(
      screen.queryByText(/Wilmington VAMC 2019 Annual Report/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/PRESS RELEASE/)).toBeInTheDocument()
    expect(screen.queryByText(/June 19, 2020/)).toBeInTheDocument()
    expect(
      screen.queryByText(
        /Virtual Town Hall Discusses COVID-19 Vaccine Hesitancy for BIPOC Veterans WEBEX Event Wednesday, April 28/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /Wilimington, DE - Virtual Town Hall Discusses COVID-19 Vaccine Hesitancy for BIPOC Veterans WEBEX Event Wednesday, April 28/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Houston health care Placeholder - News release/)
    ).toBeInTheDocument()
    expect(container.querySelectorAll('button')).toBeTruthy()
  })
})
