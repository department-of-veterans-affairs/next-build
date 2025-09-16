/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import { formatter } from './query'
import mockData from './mock.json'
import mockMenu from './mock.menu.json'
import mockServices from './mock.services.json'
import { Menu } from '@/types/drupal/menu'

describe('VamcSystemRegisterForCare formatter', () => {
  it('formats basic fields correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.title).toBe('Register for care')
    expect(result.entityId).toBe(44606)
    expect(result.entityPath).toBe('/richmond-health-care/register-for-care')
    expect(result.vamcSystem.title).toBe('VA Richmond health care')
    expect(result.menu).toBeDefined()
    expect(result.menu.rootPath).toBe(
      '/richmond-health-care/register-for-care/'
    )
  })

  it('formats topOfPageContent field correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.topOfPageContent).toBeDefined()
    expect(result.topOfPageContent.html).toContain(
      '<h2 id="patient-registration-admission">Patient registration (admissions)</h2>'
    )
  })

  it('formats bottomOfPageContent field correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
      services: mockServices,
    })

    expect(result.bottomOfPageContent).toBeDefined()
    expect(result.bottomOfPageContent.html).toContain(
      '<h2 id="not-yet-enrolled-in-va-health-"><strong>Not yet enrolled in VA health care?</strong></h2>'
    )
  })
})
