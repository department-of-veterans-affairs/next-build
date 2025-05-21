import { VamcEhrSystem } from '@/types/drupal/vamcEhr'
import { Administration } from '@/types/formatted/administration'

const LOVELL_TRICARE_ADMINISTRATION_ID = 1039

type TopTasksProps = {
  path: string
  vamcEhrSystem: VamcEhrSystem
  administration?: Administration
}

/**
 * Display a set of actionable links for a facility.
 *
 * This is used for Facility details pages and (A-Z) Health Services page.
 */
export const FacilityTopTasks = ({
  path,
  administration,
  vamcEhrSystem,
}: TopTasksProps) => {
  path = normalizePath(path)

  const topTask = topTaskLovellComp({
    linkType: 'make-an-appointment',
    path,
    administration,
    vamcEhrSystem,
  })

  return (
    <div className="usa-grid usa-grid-full vads-u-margin-bottom--6">
      <div data-template="facilities/facilities_health_services_buttons">
        <va-link-action
          class="vads-u-display--block"
          href={`${topTask.url}`}
          text={`${topTask.text}`}
          type="secondary"
        ></va-link-action>
        <va-link-action
          class="vads-u-display--block"
          href={`${path}/register-for-care`}
          text="Register for care"
          type="secondary"
        ></va-link-action>
        <va-link-action
          class="vads-u-display--block"
          href={`${path}/pharmacy`}
          text="Learn about pharmacy services"
          type="secondary"
        ></va-link-action>
      </div>
    </div>
  )
}

/**
 * Display a set of actionable links for a regional page.
 *
 * This is used for Region Landing page and Contact us page
 */
export const RegionalTopTasks = ({
  path,
  administration,
  vamcEhrSystem,
}: TopTasksProps) => {
  path = normalizePath(path)

  const topTask = topTaskLovellComp({
    linkType: 'make-an-appointment',
    path,
    administration,
    vamcEhrSystem,
  })

  return (
    <div className="usa-grid usa-grid-full vads-u-margin-top--0 vads-u-margin-bottom--3">
      <div>
        <va-link-action
          class="vads-u-display--block"
          href={`${topTask.url}`}
          text={`${topTask.text}`}
          type="secondary"
        ></va-link-action>
        <va-link-action
          class="vads-u-display--block"
          href={`${path}/health-services`}
          text="View all health services"
          type="secondary"
        ></va-link-action>
        <va-link-action
          class="vads-u-display--block"
          href={`${path}/register-for-care`}
          text="Register for care"
          type="secondary"
        ></va-link-action>
      </div>
    </div>
  )
}

/**
 * Makes sure we have exactly one / at the start of the path to avoid malformed URLs
 */
function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * Generates a text and URL object for the top task component based on the
 * provided properties.
 *
 * NOTE: May need to export this from another module later to be used elsewhere.
 */
function topTaskLovellComp({
  linkType,
  path,
  administration,
  vamcEhrSystem,
}: TopTasksProps & { linkType?: 'make-an-appointment' }): {
  text: string
  url: string
} {
  // TODO: Is this right?
  const isProd = process.env.APP_ENV === 'prod'

  return _topTaskLovellComp({
    isProd,
    linkType,
    path,
    administration,
    vamcEhrSystem,
  })
}

/**
 * Same as `topTaskLovellComp` but with an additional `isProd` flag to aid
 * testing.
 */
export function _topTaskLovellComp({
  isProd,
  linkType,
  path,
  administration,
  vamcEhrSystem,
}: TopTasksProps & { isProd: boolean; linkType?: 'make-an-appointment' }): {
  text: string
  url: string
} {
  const isPageLovell = administration?.id === LOVELL_TRICARE_ADMINISTRATION_ID

  if (
    (vamcEhrSystem === 'cerner' ||
      (vamcEhrSystem === 'cerner_staged' && !isProd)) &&
    linkType === 'make-an-appointment' &&
    isPageLovell
  ) {
    return {
      text: 'MHS Genesis Patient Portal',
      url: 'https://my.mhsgenesis.health.mil/',
    }
  }
  // fallback as default
  return {
    text: 'Make an appointment',
    url: `${path}/make-an-appointment`,
  }
}
