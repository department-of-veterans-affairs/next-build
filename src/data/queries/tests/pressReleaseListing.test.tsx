import { PressReleaseListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/pressReleaseListing.mock.json'

const PressReleaseListingMock: PressReleaseListing = mockData

describe('PressReleaseListing formatData', () => {
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
      queries.formatData('node--press_release_listing', PressReleaseListingMock)
    ).toMatchSnapshot()
  })
})
