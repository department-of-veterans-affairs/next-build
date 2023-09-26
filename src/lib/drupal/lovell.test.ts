import {
  LOVELL,
  isLovellFederalPathResource,
  isLovellTricarePathResource,
  isLovellVaPathResource,
  bifurcateLovellFederalPathResources,
  removeLovellFederalPathResources,
} from './lovell'

const lovellFederalResource = {
  path: {
    alias: `/${LOVELL.federal.slug}/stories/story-1`,
    pid: null,
    langcode: null,
  },
  administration: LOVELL.federal.administration,
}

const lovellTricareResource = {
  path: {
    alias: `/${LOVELL.tricare.slug}/stories/story-1`,
    pid: null,
    langcode: null,
  },
  administration: LOVELL.tricare.administration,
}

const lovellVaResource = {
  path: {
    alias: `/${LOVELL.va.slug}/stories/story-1`,
    pid: null,
    langcode: null,
  },
  administration: LOVELL.va.administration,
}

const otherResource = {
  path: {
    alias: '/some-other-health-care-1/stories/story-1',
    pid: null,
    langcode: null,
  },
  administration: {
    id: 1,
    name: 'Some Other health care 1',
  },
}

describe('isLovellFederalPathResource', () => {
  test('should return true when Federal resource', () => {
    const result = isLovellFederalPathResource(lovellFederalResource)
    expect(result).toBe(true)
  })

  test('should return false when TRICARE resource', () => {
    const result = isLovellFederalPathResource(lovellTricareResource)
    expect(result).toBe(false)
  })

  test('should return false when VA resource', () => {
    const result = isLovellFederalPathResource(lovellVaResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellFederalPathResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellTricarePathResource', () => {
  test('should return true when TRICARE resource', () => {
    const result = isLovellTricarePathResource(lovellTricareResource)
    expect(result).toBe(true)
  })

  test('should return false when Federal resource', () => {
    const result = isLovellTricarePathResource(lovellFederalResource)
    expect(result).toBe(false)
  })

  test('should return false when VA resource', () => {
    const result = isLovellTricarePathResource(lovellVaResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellTricarePathResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellVaPathResource', () => {
  test('should return true when VA resource', () => {
    const result = isLovellVaPathResource(lovellVaResource)
    expect(result).toBe(true)
  })

  test('should return false when Federal resource', () => {
    const result = isLovellVaPathResource(lovellFederalResource)
    expect(result).toBe(false)
  })

  test('should return false when TRICARE resource', () => {
    const result = isLovellVaPathResource(lovellTricareResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellVaPathResource(otherResource)
    expect(result).toBe(false)
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

    const federalResources = modifiedResources.filter(
      isLovellFederalPathResource
    )
    expect(federalResources.length).toBe(0)

    const tricareResources = modifiedResources.filter(
      isLovellTricarePathResource
    )
    expect(tricareResources.length).toBe(2)

    const vaResources = modifiedResources.filter(isLovellVaPathResource)
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

    const federalResources = modifiedResources.filter(
      isLovellFederalPathResource
    )
    expect(federalResources.length).toBe(0)

    const tricareResources = modifiedResources.filter(
      isLovellTricarePathResource
    )
    expect(tricareResources.length).toBe(1)

    const vaResources = modifiedResources.filter(isLovellVaPathResource)
    expect(vaResources.length).toBe(1)
  })

  test('should return original resource collection when no Federal resources are present', () => {
    const resources = [lovellTricareResource, lovellVaResource, otherResource]

    const modifiedResources = removeLovellFederalPathResources(resources)
    expect(modifiedResources).toEqual(resources)
  })
})
