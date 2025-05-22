import { LOVELL } from '../constants'
import {
  bifurcateLovellFederalPathResources,
  removeLovellFederalPathResources,
  getLovellVariantOfStaticPathResource,
} from '../staticPaths'
import {
  lovellFederalResource,
  lovellTricareResource,
  lovellVaResource,
  otherResource,
} from './mockData'
import {
  isLovellFederalResource,
  isLovellTricareResource,
  isLovellVaResource,
} from '../utils'

describe('getLovellVariantOfStaticPathResource', () => {
  const resource = {
    path: `/${LOVELL.va.pathSegment}/stories`,
    administrationId: LOVELL.va.administrationId,
  }

  test('should return resource adjusted for federal variant', () => {
    const result = getLovellVariantOfStaticPathResource(
      resource,
      LOVELL.federal.variant
    )
    expect(result).toStrictEqual({
      path: `/${LOVELL.federal.pathSegment}/stories`,
      administrationId: LOVELL.federal.administrationId,
    })
  })

  test('should return resource adjusted for TRICARE variant', () => {
    const result = getLovellVariantOfStaticPathResource(
      resource,
      LOVELL.tricare.variant
    )
    expect(result).toStrictEqual({
      path: `/${LOVELL.tricare.pathSegment}/stories`,
      administrationId: LOVELL.tricare.administrationId,
    })
  })

  test('should return resource (unchanged) for VA variant', () => {
    const result = getLovellVariantOfStaticPathResource(
      resource,
      LOVELL.va.variant
    )
    expect(result).toStrictEqual(resource)
  })
})

describe('bifurcateLovellFederalPathResources', () => {
  test('should return one additional TRICARE resource and one additional VA resource when one Federal resource is present', () => {
    const resources = [
      lovellFederalResource,
      lovellTricareResource,
      lovellVaResource,
      otherResource,
    ]

    const modifiedResources = bifurcateLovellFederalPathResources(resources)
    expect(modifiedResources.length).toBe(5)

    const federalResources = modifiedResources.filter(isLovellFederalResource)
    expect(federalResources.length).toBe(0)

    const tricareResources = modifiedResources.filter(isLovellTricareResource)
    expect(tricareResources.length).toBe(2)

    const vaResources = modifiedResources.filter(isLovellVaResource)
    expect(vaResources.length).toBe(2)
  })

  test('should return original resource collection when no Federal resources are present', () => {
    const resources = [lovellTricareResource, lovellVaResource, otherResource]

    const modifiedResources = bifurcateLovellFederalPathResources(resources)
    expect(modifiedResources).toEqual(resources)
  })
})

describe('removeLovellFederalPathResources', () => {
  test('should remove Federal resources if present, but leave VA and TRICARE resources', () => {
    const resources = [
      lovellFederalResource,
      lovellTricareResource,
      lovellVaResource,
      otherResource,
    ]

    const modifiedResources = removeLovellFederalPathResources(resources)
    expect(modifiedResources.length).toBe(3)

    const federalResources = modifiedResources.filter(isLovellFederalResource)
    expect(federalResources.length).toBe(0)

    const tricareResources = modifiedResources.filter(isLovellTricareResource)
    expect(tricareResources.length).toBe(1)

    const vaResources = modifiedResources.filter(isLovellVaResource)
    expect(vaResources.length).toBe(1)
  })

  test('should return original resource collection when no Federal resources are present', () => {
    const resources = [lovellTricareResource, lovellVaResource, otherResource]

    const modifiedResources = removeLovellFederalPathResources(resources)
    expect(modifiedResources).toEqual(resources)
  })
})
