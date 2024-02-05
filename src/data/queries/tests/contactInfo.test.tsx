import { ParagraphContactInformation } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/contactInfo.mock.json'

const ContactInfoMock: ParagraphContactInformation = mockData

describe('ContactInfo formatData', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)

    expect(
      queries.formatData('paragraph--contact_information', ContactInfoMock)
    ).toMatchSnapshot()
  })
})
