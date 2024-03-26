import { ParagraphAlertSingle } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/alertSingle.mock'

const AlertSingle: ParagraphAlertSingle = mockResponse

describe('alert single formatData', () => {
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
      queries.formatData('paragraph--alert_single', AlertSingle)
    ).toMatchSnapshot()
  })
})
