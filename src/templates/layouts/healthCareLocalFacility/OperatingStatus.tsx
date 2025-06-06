import { FacilityOperatingStatusFlags } from '@/types/drupal/node'

interface OperatingStatusFlagsProps {
  operatingStatusFacility: FacilityOperatingStatusFlags
  basePath: string
}

/**
 * Return a <va-alert> with the appropriate status and link to the operating
 * status page.
 *
 * Returns null if the operating status is 'normal' or if the menu data doesn't
 * have the expected link.
 */
export const OperatingStatusFlags = ({
  operatingStatusFacility,
  basePath,
}: OperatingStatusFlagsProps) => {
  if (!basePath || operatingStatusFacility === 'normal') {
    return null
  }

  const presentations: Record<
    FacilityOperatingStatusFlags,
    { status: 'info' | 'warning' | 'error'; text: string }
  > = {
    notice: { status: 'info', text: 'Facility notice' },
    limited: { status: 'info', text: 'Limited services and hours' },
    temporary_closure: {
      status: 'warning',
      text: 'Temporary facility closure',
    },
    temporary_location: { status: 'warning', text: 'Temporary location' },
    virtual_care: { status: 'warning', text: 'Virtual care only' },
    coming_soon: { status: 'warning', text: 'Coming soon' },
    closed: { status: 'warning', text: 'Facility closed' },
  }

  if (Object.keys(presentations).includes(operatingStatusFacility)) {
    const { status, text } = presentations[operatingStatusFacility]
    return (
      <div className="vads-u-display--inline-block vads-u-margin-bottom--1">
        <va-alert status={status} slim visible>
          <va-link
            class="vads-u-font-weight--bold operating-status-link"
            href={`${basePath}/operating-status`}
            text={text}
          ></va-link>
        </va-alert>
      </div>
    )
  }

  // Fallthrough for unexpected statuses
  return null
}
