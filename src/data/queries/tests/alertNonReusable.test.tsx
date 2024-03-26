import { ParagraphNonReusableAlert } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/alertNonReusable.mock'

const AlertNonResuableMock: ParagraphNonReusableAlert = mockResponse

describe('alert non reusable formatData', () => {
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
      queries.formatData('paragraph--non_reusable_alert', AlertNonResuableMock)
    ).toMatchSnapshot()
  })
})
