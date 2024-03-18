import { ParagraphNumberCallout } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/numberCallout.mock'

const NumberCalloutMock: ParagraphNumberCallout = mockResponse

describe('NumberCallout formatData', () => {
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
      queries.formatData('paragraph--number_callout', NumberCalloutMock)
    ).toMatchSnapshot()
  })
})
