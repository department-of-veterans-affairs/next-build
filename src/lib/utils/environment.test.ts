import { generateAbsoluteUrlFromBuildType } from './environment'
import { environments } from '@/lib/constants/environment'

describe('generateAbsoluteUrlFromBuildType', () => {
  test('should properly handle url with leading slash', () => {
    const relativeUrl = '/some/path'
    const result = generateAbsoluteUrlFromBuildType(
      relativeUrl,
      environments.PROD
    )
    expect(result).toBe('https://www.va.gov/some/path')
  })

  test('should properly handle url without leading slash', () => {
    const relativeUrl = 'some/path'
    const result = generateAbsoluteUrlFromBuildType(
      relativeUrl,
      environments.PROD
    )
    expect(result).toBe('https://www.va.gov/some/path')
  })

  test('should return relative url if buildType is not valid', () => {
    const relativeUrl = '/some/path'
    const result = generateAbsoluteUrlFromBuildType(
      relativeUrl,
      'invalidBuildType'
    )
    expect(result).toBe(relativeUrl)
  })
})
