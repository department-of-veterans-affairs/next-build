import { transformStaffProfileData } from './dataService'
import { mockResponse } from '../../../mocks/staffProfile.mock'

jest.mock('@/data/queries', () => ({
  queries: {
    formatData: jest.fn(),
  },
}))

describe('transformStaffProfileData', () => {
  it('should return transformed staff profile data', () => {
    const entity = mockResponse

    const expectedStaffProfile = {
      id: '7783e76f-5aca-4d14-9f5e-fb00cc11e4da',
      name: 'William Smathers Mr',
      linkToBio: true,
      path: 'http:va.gov',
      description: 'OEF Transition Patient Advocate',
      phone: '412-551-9651',
      email: 'william.smathers@aol.com',
    }

    const result = transformStaffProfileData(entity)

    expect(result).toEqual(expectedStaffProfile)
  })
})
