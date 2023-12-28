import { queries } from '@/data/queries'
import mockData from '@/mocks/linkTeaser.mock.json'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'

const linkTeaserMock: ParagraphLinkTeaser[] = mockData

describe('paragraph--link_teaser formatData', () => {
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
      linkTeaserMock.map((linkTeaser) => {
        return queries.formatData('paragraph--link_teaser', linkTeaser)
      })
    ).toMatchSnapshot()
  })
})
