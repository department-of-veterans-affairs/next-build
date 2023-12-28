import { queries } from '@/data/queries'
import { ParagraphEmailContact } from '@/types/drupal/paragraph'
import mockData from '@/mocks/emailContact.mock.json'

const emailMock: ParagraphEmailContact = mockData

describe('paragraph--email_contact formatData', () => {
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
      queries.formatData('paragraph--email_contact', emailMock)
    ).toMatchSnapshot()
  })
})
