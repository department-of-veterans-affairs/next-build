import { LOVELL } from '@/lib/drupal/lovell/constants'
import { FacilityTopTasks, RegionalTopTasks, _topTaskLovellComp } from './index'
import { render } from '@testing-library/react'

describe('FacilityTopTasks', () => {
  it('should render the normal links', () => {
    const { container } = render(
      <FacilityTopTasks path="/test-nav-path" vamcEhrSystem="vista" />
    )
    expect(
      container.querySelector('va-link-action[text="Make an appointment"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('va-link-action[text="Register for care"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        'va-link-action[text="Learn about pharmacy services"]'
      )
    ).toBeInTheDocument()
  })

  it('should render the MHS link', () => {
    const { container } = render(
      <FacilityTopTasks
        path="/test-nav-path"
        vamcEhrSystem="cerner"
        administration={LOVELL.tricare.administration}
      />
    )
    expect(
      container.querySelector(
        'va-link-action[text="MHS Genesis Patient Portal"]'
      )
    ).toBeInTheDocument()
  })

  it('should handle no slash in the path', () => {
    const { container } = render(
      <FacilityTopTasks path="test-nav-path" vamcEhrSystem="vista" />
    )
    expect(
      container.querySelector(
        'va-link-action[href="/test-nav-path/register-for-care"]'
      )
    ).toBeInTheDocument()
  })
})

describe('RegionalTopTasks', () => {
  it('should render the normal links', () => {
    const { container } = render(
      <RegionalTopTasks path="/test-nav-path" vamcEhrSystem="vista" />
    )
    expect(
      container.querySelector('va-link-action[text="Make an appointment"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('va-link-action[text="View all health services"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('va-link-action[text="Register for care"]')
    ).toBeInTheDocument()
  })

  it('should render the MHS link', () => {
    const { container } = render(
      <RegionalTopTasks
        path="/test-nav-path"
        vamcEhrSystem="cerner"
        administration={LOVELL.tricare.administration}
      />
    )
    expect(
      container.querySelector(
        'va-link-action[text="MHS Genesis Patient Portal"]'
      )
    ).toBeInTheDocument()
  })

  it('should handle no slash in the path', () => {
    const { container } = render(
      <RegionalTopTasks path="test-nav-path" vamcEhrSystem="vista" />
    )
    expect(
      container.querySelector(
        'va-link-action[href="/test-nav-path/register-for-care"]'
      )
    ).toBeInTheDocument()
  })
})

describe('topTaskLovellComp', () => {
  const cerner = { vamcEhrSystem: 'cerner' } as const
  const mhsLinkData: Parameters<typeof _topTaskLovellComp>[0] = {
    isProd: true,
    linkType: 'make-an-appointment',
    path: '/test-nav-path',
    administration: LOVELL.tricare.administration,
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

  it("should show the normal link if the page isn't Lovell TRICARE", () => {
    expect(
      _topTaskLovellComp({
        ...mhsLinkData,
        administration: LOVELL.va.administration,
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
