import { render, screen } from '@testing-library/react'
import { PressRelease } from './index'
import { getByText } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'

const contacts = [
  {
    id: '96668498-d442-4b55-8b14-7ec90410f418',
    name: 'Vance Janes',
    description: 'Public Affairs Officer',
    phone: '828-298-7911, ext. 4446',
    email: 'vance.janes@va.gov',
  },
]

const downloads = [
  {
    id: '4dc62f71-cc99-49ae-8337-1acaa8e9ad2a',
    type: 'media--document',
    name: 'Vets Day 2021.pdf',
    uri: '/sites/default/files/2021-10/Vets%20Day%202021.pdf',
  },
]

const data = {
  title: 'Wilmington VAMC 2019 Annual Report',
  id: '398575',
  type: 'node--press_release',
  published: false,
  lastUpdated: '',
  releaseDate: '2020-06-19T10:25:28-04:00',
  pdfVersion:
    '/sites/default/files/2021-04/WilmingtonVAMC_Annual_Report_2019_web.pdf',
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
  contacts: contacts,
  downloads: downloads,
  listing: '/wilmington-health-care/news-releases',
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
    const { container, getByText } = render(<PressRelease {...data} />)
    const linkElement = getByText(/Download press release \(PDF\)/i)

    expect(
      screen.queryByText(/Wilmington VAMC 2019 Annual Report/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/PRESS RELEASE/)).toBeInTheDocument()
    expect(screen.queryByText(/June 19, 2020/)).toBeInTheDocument()
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute(
      'href',
      '/sites/default/files/2021-04/WilmingtonVAMC_Annual_Report_2019_web.pdf'
    )
    expect(
      screen.queryByText(
        /Virtual Town Hall Discusses COVID-19 Vaccine Hesitancy for BIPOC Veterans WEBEX Event Wednesday, April 28/
      )
    ).toBeInTheDocument()
    expect(screen.queryByText(/Wilimington, DE -/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Houston health care Placeholder - News release/)
    ).toBeInTheDocument()
    expect(container.querySelectorAll('button')).toBeTruthy()
  })
  test('renders component without pdfVersion', () => {
    data.pdfVersion = null
    const { container } = render(<PressRelease {...data} />)
    const linkElement = screen.queryByText(/Download press release \(PDF\)/i)
    expect(linkElement).toBeNull()
  })
  test('renders contacts', () => {
    render(<PressRelease {...data} />)
    contacts.forEach((contact) => {
      expect(
        screen.getByText(`${contact.name} , ${contact.description}`)
      ).toBeInTheDocument()
      expect(screen.getByText(contact.phone)).toBeInTheDocument()
      const emailLink = screen.getByText(contact.email)
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute('href', `mailto:${contact.email}`)
    })
  })

  test('renders contacts when null', () => {
    data.contacts = [null]
    render(<PressRelease {...data} />)
    expect(screen.queryByText('null')).toBeNull()
  })

  test('renders the downloads', () => {
    render(<PressRelease {...data} />)
    downloads.forEach((download) => {
      const link = screen.getByText(`Download ${download.name}`)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', download.uri)
    })
  })

  test('renders downloads when null', () => {
    data.downloads = [null]
    render(<PressRelease {...data} />)
    expect(screen.queryByText('null')).toBeNull()
  })

  // Mock the window.print function
  window.print = jest.fn()
  test('renders the print button and handles click', () => {
    render(<PressRelease {...data} />)
    const printButton = screen.getByText('Print')
    fireEvent.click(printButton)
    expect(window.print).toHaveBeenCalled()
  })
})
