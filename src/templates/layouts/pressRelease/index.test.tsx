import { render, screen } from '@testing-library/react'
import { PressRelease } from './index'
import { getByText } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { getByTestId } from '@testing-library/dom'

const contacts = [
  {
    id: '96668498-d442-4b55-8b14-7ec90410f418',
    name: 'Vance Janes',
    description: 'Public Affairs Officer',
    numbers: [
      {
        id: 'a93d21bb-3ee0-4ffe-9996-91f7c6e6bdc3',
        type: 'phone',
        number: '617-435-7809',
        ext: null,
      },
      {
        id: 'a93d21bb-3ee0-4ffe-9996-91f7c6e6bdc4',
        type: 'sms',
        number: '617-435-7810',
        ext: null,
      },
      {
        id: 'a93d21bb-3ee0-4ffe-9996-91f7c6e6bdc5',
        type: 'tty',
        number: '617-435-7811',
        ext: null,
      },
      {
        id: 'a93d21bb-3ee0-4ffe-9996-91f7c6e6bdc6',
        type: 'phone',
        number: '617-435-7812',
        ext: '111',
      },
      {
        id: 'a93d21bb-3ee0-4ffe-9996-91f7c6e6bdc6',
        type: 'fax',
        number: '617-435-7813',
        ext: null,
      },
    ],
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
  {
    id: '4dc62f71-cc99-49ae-8337-1acaa8e9ad2b',
    type: 'media--image',
    name: '2B4A3981.JPG',
    uri: '/sites/default/files/2021-10/2B4A3981.JPG',
  },
  {
    id: '4dc62f71-cc99-49ae-8337-1acaa8e9ad2c',
    type: 'media--video',
    name: 'Video to watch',
    uri: 'https://www.youtube.com/watch?v=RMtx4jvpI_c',
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
        screen.getByText(`${contact.name}, ${contact.description}`)
      ).toBeInTheDocument()
      const emailLink = screen.getByText(contact.email)
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute('href', `mailto:${contact.email}`)
      expect(screen.getByTestId('phone-0')).toBeInTheDocument()
    })
  })

  test('renders contact phone', () => {
    render(<PressRelease {...data} />)
    const voice = screen.getByTestId('phone-0')
    const sms = screen.getByTestId('phone-1')
    const tty = screen.getByTestId('phone-2')
    const ext = screen.getByTestId('phone-3')
    const fax = screen.getByTestId('phone-4')
    expect(voice).toBeInTheDocument()
    expect(voice).toHaveAttribute('contact', data.contacts[0].numbers[0].number)
    expect(voice).not.toHaveAttribute('sms')
    expect(voice).not.toHaveAttribute('tty')
    expect(voice).not.toHaveAttribute('extension')
    expect(voice).toHaveAttribute('message-aria-describedby', 'Phone')
    expect(screen.getByTestId('phone-label-0')).toHaveTextContent('Phone:')
    expect(sms).toBeInTheDocument()
    expect(sms).toHaveAttribute('contact', data.contacts[0].numbers[1].number)
    expect(sms).toHaveAttribute('sms')
    expect(sms).not.toHaveAttribute('tty')
    expect(sms).not.toHaveAttribute('extension')
    expect(sms).toHaveAttribute('message-aria-describedby', 'Phone')
    expect(screen.getByTestId('phone-label-1')).toHaveTextContent('Phone:')
    expect(tty).toBeInTheDocument()
    expect(tty).toHaveAttribute('contact', data.contacts[0].numbers[2].number)
    expect(tty).not.toHaveAttribute('sms')
    expect(tty).toHaveAttribute('tty')
    expect(tty).not.toHaveAttribute('extension')
    expect(tty).toHaveAttribute('message-aria-describedby', 'Phone')
    expect(screen.getByTestId('phone-label-2')).toHaveTextContent('Phone:')
    expect(ext).toBeInTheDocument()
    expect(ext).toHaveAttribute('contact', data.contacts[0].numbers[3].number)
    expect(ext).not.toHaveAttribute('sms')
    expect(ext).not.toHaveAttribute('tty')
    expect(ext).toHaveAttribute('extension', data.contacts[0].numbers[3].ext)
    expect(ext).toHaveAttribute('message-aria-describedby', 'Phone')
    expect(screen.getByTestId('phone-label-3')).toHaveTextContent('Phone:')
    expect(fax).toBeInTheDocument()
    expect(fax).toHaveAttribute('contact', data.contacts[0].numbers[4].number)
    expect(fax).not.toHaveAttribute('sms')
    expect(fax).not.toHaveAttribute('tty')
    expect(fax).not.toHaveAttribute('extension')
    expect(fax).toHaveAttribute('message-aria-describedby', 'Fax')
    expect(screen.getByTestId('phone-label-4')).toHaveTextContent('Fax:')
  })

  test('does not render numbers if null', () => {
    const nullNumbers = { ...data }
    nullNumbers.contacts[0].numbers = null
    render(<PressRelease {...data} />)
    expect(screen.queryByTestId('phone-0')).not.toBeInTheDocument()
  })

  test('renders contacts when null', () => {
    data.contacts = [null]
    render(<PressRelease {...data} />)
    expect(screen.queryByText('null')).toBeNull()
  })

  test('does not render Media contacts header when no contacts exist', () => {
    data.contacts = []
    render(<PressRelease {...data} />)
    expect(screen.queryByText('Media contacts')).not.toBeInTheDocument()
  })

  test('does not render Media contacts header when contacts is null', () => {
    data.contacts = null
    render(<PressRelease {...data} />)
    expect(screen.queryByText('Media contacts')).not.toBeInTheDocument()
  })

  test('renders the downloads', () => {
    render(<PressRelease {...data} />)
    const document = screen.getByTestId('document')
    const image = screen.getByTestId('image')
    const video = screen.getByTestId('video')
    expect(document).toHaveAttribute('filetype', 'pdf')
    expect(document).toHaveAttribute('download')
    expect(document).toHaveAttribute('text', downloads[0].name)
    expect(document).toHaveAttribute('href', downloads[0].uri)
    expect(image).toHaveAttribute('filetype', 'JPG')
    expect(image).toHaveAttribute('download')
    expect(image).toHaveAttribute('text', `Download ${downloads[1].name}`)
    expect(image).toHaveAttribute('href', downloads[1].uri)
    expect(video).not.toHaveAttribute('filetype')
    expect(video).not.toHaveAttribute('download')
    expect(video).toHaveAttribute('text', downloads[2].name)
    expect(video).toHaveAttribute('href', downloads[2].uri)
    expect(video).toHaveAttribute('video')
  })

  test('does not render downloads when null', () => {
    const dataWithNoDownloads = { ...data }
    dataWithNoDownloads.downloads = []
    render(<PressRelease {...dataWithNoDownloads} />)
    expect(screen.queryByTestId('downloads')).not.toBeInTheDocument()
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
