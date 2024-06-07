import { PressReleaseTeaser } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/pressReleaseTeaser.mock.json'

const PressReleaseTeaserMock: PressReleaseTeaser = mockData

describe('PressReleaseTeaser formatData', () => {
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
      queries.formatData('node--press_release_teaser', PressReleaseTeaserMock)
    ).toMatchSnapshot()
  })
})
