import { queries } from '@/data/queries'
import { ParagraphPhoneNumber } from '@/types/drupal/paragraph'
import mockData from '@/mocks/phoneNumber.mock.json'

const phoneMock: ParagraphPhoneNumber = mockData

describe('paragraph--phone_number formatData', () => {
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
      queries.formatData('paragraph--phone_number', phoneMock)
    ).toMatchSnapshot()
  })
})
