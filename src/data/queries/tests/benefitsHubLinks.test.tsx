import { NodeLandingPage } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/benefitHubs.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

// field_related_office is causing issues here, I believe because the referenced node is unpublished (node/38439)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeBenefitsHubMock: NodeLandingPage[] = mockData

describe(`${RESOURCE_TYPES.BENEFITS_HUB} formatData`, () => {
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
      queries.formatData(RESOURCE_TYPES.BENEFITS_HUB, nodeBenefitsHubMock)
    ).toMatchSnapshot()
  })
})
