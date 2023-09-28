import {
  LOVELL,
  isLovellFederalResource,
  isLovellTricareResource,
  isLovellVaResource,
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

describe('isLovellFederalResource', () => {
  test('should return true when Federal resource', () => {
    const result = isLovellFederalResource(lovellFederalResource)
    expect(result).toBe(true)
  })

  test('should return false when TRICARE resource', () => {
    const result = isLovellFederalResource(lovellTricareResource)
    expect(result).toBe(false)
  })

  test('should return false when VA resource', () => {
    const result = isLovellFederalResource(lovellVaResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellFederalResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellTricareResource', () => {
  test('should return true when TRICARE resource', () => {
    const result = isLovellTricareResource(lovellTricareResource)
    expect(result).toBe(true)
  })

  test('should return false when Federal resource', () => {
    const result = isLovellTricareResource(lovellFederalResource)
    expect(result).toBe(false)
  })

  test('should return false when VA resource', () => {
    const result = isLovellTricareResource(lovellVaResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellTricareResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellVaResource', () => {
  test('should return true when VA resource', () => {
    const result = isLovellVaResource(lovellVaResource)
    expect(result).toBe(true)
  })

  test('should return false when Federal resource', () => {
    const result = isLovellVaResource(lovellFederalResource)
    expect(result).toBe(false)
  })

  test('should return false when TRICARE resource', () => {
    const result = isLovellVaResource(lovellTricareResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellVaResource(otherResource)
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
