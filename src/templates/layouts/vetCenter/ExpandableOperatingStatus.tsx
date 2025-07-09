import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import {
  VaAlert,
  VaAlertExpandable,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'

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

    const alert = operatingStatusMoreInfo ? (
      <VaAlertExpandable
        trigger={text}
        status={status}
        className="vads-u-margin-y--0 vamc-facility-expandable-alert vads-u-measure--1"
      >
        <p dangerouslySetInnerHTML={{ __html: operatingStatusMoreInfo }} />
      </VaAlertExpandable>
    ) : (
      <VaAlert
        status={status}
        className="vads-u-margin-y--0 vads-u-measure--1"
        slim
      >
        <p className="vads-u-margin-y--0 vads-u-padding-y--0 vads-u-font-weight--bold">
          {text}
        </p>
      </VaAlert>
    )

    return <div className="vads-u-margin-bottom--1">{alert}</div>
  }

  return null
}
