import { FacilityOperatingStatusFlags } from '@/types/drupal/node'

const statusAlerts: Record<
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

interface ExpandableOperatingStatusProps {
  operatingStatusFlag: FacilityOperatingStatusFlags
  operatingStatusMoreInfo: string | null
}

/**
 * Returns an alert with the appropriate operating status.
 * Returns null if the operating status is 'normal' or invalid.
 */
export const ExpandableOperatingStatus = ({
  operatingStatusFlag,
  operatingStatusMoreInfo,
}: ExpandableOperatingStatusProps) => {
  const statusAlert = statusAlerts[operatingStatusFlag]
  if (statusAlert) {
    const { status, text } = statusAlert
    const style = { maxWidth: '303px' }

    const alert = operatingStatusMoreInfo ? (
      <va-alert-expandable
        trigger={text}
        status={status}
        className="vads-u-margin-y--0 vamc-facility-expandable-alert"
        style={style}
      >
        <p dangerouslySetInnerHTML={{ __html: operatingStatusMoreInfo }} />
      </va-alert-expandable>
    ) : (
      <va-alert
        status={status}
        className="vads-u-margin-y--0"
        slim
        style={style}
      >
        <p className="vads-u-margin-y--0 vads-u-padding-y--0 vads-u-font-weight--bold">
          {text}
        </p>
      </va-alert>
    )

    return <div className="vads-u-margin-bottom--1">{alert}</div>
  }

  return null
}
