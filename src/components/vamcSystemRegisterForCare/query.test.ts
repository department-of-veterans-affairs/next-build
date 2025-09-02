import { formatter } from './query'
import mockData from './mock.json'

describe('VamcSystemRegisterForCare formatter', () => {
  it('formats basic fields correctly', () => {
    const result = formatter({ entity: mockData })

    expect(result.title).toBe('Register for care')
    expect(result.entityId).toBe(44606)
    expect(result.entityPath).toBe('/richmond-health-care/register-for-care')
    expect(result.vamcSystem.title).toBe('VA Richmond health care')
  })

  // it('formats centralized content fields', () => {
  //   const result = formatter({ entity: mockData })

  //   expect(result.topOfPageContent).toBeDefined()
  //   expect(result.bottomOfPageContent).toBeDefined()
  //   expect(result.relatedLinks).toBeDefined()
  // })
})
