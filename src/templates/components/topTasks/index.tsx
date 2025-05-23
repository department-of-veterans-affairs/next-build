import { VamcEhr } from '@/types/drupal/vamcEhr'

type VamcEhrSystem = VamcEhr['field_region_page']['field_vamc_ehr_system']

type TopTasksProps = {
  path: string
  vamcEhrSystem: VamcEhrSystem
  administration?: { entityId: number }
  regionPage?: { vamcEhrSystem: VamcEhrSystem }
  office?: { vamcEhrSystem: VamcEhrSystem }
}

/**
 * Display a set of actionable links for a facility.
 *
 * This is used for Facility details pages and (A-Z) Health Services page.
 */
export const TopTasks = ({
  path,
  administration,
  vamcEhrSystem,
  regionPage,
  office,
}: TopTasksProps) => {
  // Make sure we have exactly one / at the start of the path to avoid malformed
  // URLs.
  const slashPath = path.startsWith('/') ? path : `/${path}`

  const topTask = topTaskLovellComp({
    linkType: 'make-an-appointment',
    path: slashPath,
    administration,
    vamcEhrSystem,
    regionPage,
    office,
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
          href={`${slashPath}/register-for-care`}
          text="Register for care"
          type="secondary"
        ></va-link-action>
        <va-link-action
          class="vads-u-display--block"
          href={`${slashPath}/pharmacy`}
          text="Learn about pharmacy services"
          type="secondary"
        ></va-link-action>
      </div>
    </div>
  )
}

/**
 * Generates a text and URL object for the top task component based on the
 * provided properties.
 *
 * NOTE: May need to export this from another module later to be used elsewhere.
 */
const topTaskLovellComp = ({
  linkType,
  path,
  administration,
  vamcEhrSystem,
  regionPage,
  office,
}: TopTasksProps & { linkType?: 'make-an-appointment' }): {
  text: string
  url: string
} => {
  // TODO: Is this right?
  const isProd = process.env.APP_ENV === 'prod'

  return _topTaskLovellComp({
    isProd,
    linkType,
    path,
    administration,
    vamcEhrSystem,
    regionPage,
    office,
  })
}

/**
 * Same as `topTaskLovellComp` but with an additional `isProd` flag to aid
 * testing.
 */
export const _topTaskLovellComp = ({
  isProd,
  linkType,
  path,
  administration,
  vamcEhrSystem,
  regionPage,
  office,
}: TopTasksProps & { isProd: boolean; linkType?: 'make-an-appointment' }): {
  text: string
  url: string
} => {
  const flag =
    vamcEhrSystem || office?.vamcEhrSystem || regionPage?.vamcEhrSystem || ''

  const isPageLovell = administration?.entityId === 1039

  if (
    (flag === 'cerner' || (flag === 'cerner_staged' && !isProd)) &&
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
