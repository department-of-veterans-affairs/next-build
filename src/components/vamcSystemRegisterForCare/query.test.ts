/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import { formatter } from './query'
import mockData from './mock.json'
import mockMenu from './mock.menu.json'
import { Menu } from '@/types/drupal/menu'

describe('VamcSystemRegisterForCare formatter', () => {
  it('formats basic fields correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
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
    })

    expect(result.topOfPageContent).toBeDefined()
    expect(result.topOfPageContent.html).toBe(
      '<h2 id="patient-registration-admission">Patient registration (admissions)</h2>\n\n<p>Whether you moved and need to change your medical center or need a primary care provider in the area, we can help. Call us or visit one of our patient registration offices to get started.</p>'
    )
  })

  // it('formats centralized content fields', () => {
  //   const result = formatter({ entity: mockData })

  //   expect(result.bottomOfPageContent).toBeDefined()
  //   expect(result.relatedLinks).toBeDefined()
  // })
})
