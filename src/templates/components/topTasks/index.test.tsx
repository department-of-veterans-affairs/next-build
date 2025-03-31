import { ComponentProps } from 'react'
import { TopTasks, _topTaskLovellComp } from './index'
import { off } from 'process'

const mockData: ComponentProps<typeof TopTasks> = {
  path: '/test-nav-path',
  vamcEhrSystem: 'vista',
}

const lovellAdministration = { entityId: 1039 }

describe('TopTasks', () => {
  it('should render', () => {})
})

describe('topTaskLovellComp', () => {
  const cerner = { vamcEhrSystem: 'cerner' } as const
  const mhsLinkData: Parameters<typeof _topTaskLovellComp>[0] = {
    isProd: true,
    linkType: 'make-an-appointment',
    path: '/test-nav-path',
    administration: lovellAdministration,
    ...cerner,
  }
  const mhsLink = {
    text: 'MHS Genesis Patient Portal',
    url: 'https://my.mhsgenesis.health.mil/',
  }
  const normalLink = {
    text: 'Make an appointment',
    url: `${mhsLinkData.path}/make-an-appointment`,
  }

  it('should show the MHS link vamcEhrSystem is cerner', () => {
    expect(_topTaskLovellComp(mhsLinkData)).toEqual(mhsLink)
  })

  it('should fall back to office.vamcEhrSystem', () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        vamcEhrSystem: null,
        office: cerner,
      })
    ).toEqual(mhsLink)
  })

  it('should fall back to regionPage.vamcEhrSystem', () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        vamcEhrSystem: null,
        regionPage: cerner,
      })
    ).toEqual(mhsLink)
  })

  it('should show the MHS link with cerner_staged on dev', () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        vamcEhrSystem: 'cerner_staged',
        isProd: false,
      })
    ).toEqual(mhsLink)
  })

  it('should show the normal link with cerner_staged on prod', () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        vamcEhrSystem: 'cerner_staged',
        isProd: true,
      })
    ).toEqual(normalLink)
  })

  it("should show the normal link if the link type isn't 'make-an-appointment'", () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        // @ts-expect-error TypeScript should catch this, but just in case...
        linkType: 'other-link-type',
      })
    ).toEqual(normalLink)
  })

  it("should show the normal link if the page isn't Lovell", () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        administration: { entityId: 1040 }, // Lovell is 1039
      })
    ).toEqual(normalLink)
  })

  it('should show the normal link if the vamcEhrSystem is vista', () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        vamcEhrSystem: 'vista',
      })
    ).toEqual(normalLink)
  })

  it('should show normal link if all vamcEhrSystem values are null', () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        vamcEhrSystem: null,
        office: undefined,
        regionPage: undefined,
      })
    ).toEqual(normalLink)
  })

  it('should show normal link if linkType is undefined', () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        linkType: undefined,
      })
    ).toEqual(normalLink)
  })
})
