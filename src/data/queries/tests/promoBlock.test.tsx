import { BlockPromo } from '@/types/drupal/block'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/promoBlock.mock'

//eslint-disable-next-line
const PromoBlock: BlockPromo | any = mockResponse

describe('promoBlock formatData', () => {
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
      queries.formatData('block_content--promo', PromoBlock)
    ).toMatchSnapshot()
  })
})
