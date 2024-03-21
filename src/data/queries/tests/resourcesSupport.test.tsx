import { NodeSupportResourcesDetailPage } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/resourcesSupport.mock'

//eslint-disable-next-line
const MockSupportResources: NodeSupportResourcesDetailPage | any = mockResponse

describe('Resources Support formatData', () => {
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
      queries.formatData(
        'node--support_resources_detail_page',
        MockSupportResources
      )
    ).toMatchSnapshot()
  })
})
