import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/healthCareLocalFacility.mock.json'
import { DrupalMenuLinkContent } from 'next-drupal'

const HealthCareLocalFacilityMock: NodeHealthCareLocalFacility = mockData

describe('HealthCareLocalFacility formatData', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)
    const menuItem: DrupalMenuLinkContent = {
      title: 'Foo',
      type: 'meh',
      url: '/nowhere/in-particular',
      id: 'foo',
      description: 'bar',
      enabled: true,
      expanded: true,
      menu_name: 'baz',
      meta: {},
      options: {},
      parent: null,
      provider: null,
      route: null,
      weight: '0',
    }

    expect(
      queries.formatData('node--health_care_local_facility', {
        entity: HealthCareLocalFacilityMock,
        menu: {
          items: [menuItem],
          tree: [menuItem],
        },
      })
    ).toMatchSnapshot()
  })
})
