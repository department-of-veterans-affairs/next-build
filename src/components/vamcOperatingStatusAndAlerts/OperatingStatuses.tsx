import { OperatingStatus as FormattedOperatingStatus } from './formatted-type'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'

interface OperatingStatusesProps {
  operatingStatuses: FormattedOperatingStatus[]
}
export function OperatingStatuses({
  operatingStatuses,
}: OperatingStatusesProps) {
  const formatStatus = (status: FacilityOperatingStatusFlags) => {
    switch (status) {
      case 'notice':
        return (
          <va-alert slim status="info" visible data-testid="notice-status">
            Facility notice
          </va-alert>
        )
      case 'normal':
        return (
          <span
            className="operating-status vads-u-margin-top--1p5 vads-u-display--block"
            data-testid="normal-status"
          >
            Normal services and hours
          </span>
        )
      case 'limited':
        return (
          <va-alert slim status="info" visible data-testid="limited-status">
            Limited services and hours
          </va-alert>
        )
      case 'closed':
        return (
          <va-alert slim status="warning" visible data-testid="closed-status">
            Facility Closed
          </va-alert>
        )
      case 'temporary_closure':
        return (
          <va-alert
            slim
            status="warning"
            visible
            data-testid="temporary_closure-status"
          >
            Temporary facility closure
          </va-alert>
        )
      case 'temporary_location':
        return (
          <va-alert
            slim
            status="warning"
            visible
            data-testid="temporary_location-status"
          >
            Temporary location
          </va-alert>
        )
      case 'virtual_care':
        return (
          <va-alert
            slim
            status="warning"
            visible
            data-testid="virtual_care-status"
          >
            Virtual care only
          </va-alert>
        )
      case 'coming_soon':
        return (
          <va-alert
            slim
            status="warning"
            visible
            data-testid="coming_soon-status"
          >
            Coming soon
          </va-alert>
        )
      default:
        return ''
    }
  }
  return (
    <section id="operating-statuses">
      <h2 id="facility-operating-statuses">Facility operating statuses</h2>
      <ul className="usa-unstyled-list vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-x--0">
        {operatingStatuses.map((operatingStatus, index) => (
          <li
            key={index}
            className="vads-u-align-content--center vads-grid-row vads-grid-gap vads-max-width--100 vads-u-border-top--1px vads-u-border-color--gray-light"
          >
            <div className="vads-grid-col-12 tablet:vads-grid-col-5 vads-u-margin--0 vads-u-padding-y--3">
              <p className="vads-u-margin--0 ">
                <va-link
                  class="vads-u-font-weight--bold"
                  href={operatingStatus.url}
                  text={operatingStatus.title}
                />
              </p>
            </div>
            <div className="vads-grid-col-12 tablet:vads-grid-col-7 vads-u-margin--0 vads-u-padding-y--1p5">
              <p className="vads-u-margin--0">
                {formatStatus(operatingStatus.status)}
              </p>
              {operatingStatus.statusInfo &&
                operatingStatus.status !== 'normal' && (
                  <p
                    className="vads-u-margin-bottom--0"
                    data-testid="status-info"
                    dangerouslySetInnerHTML={{
                      __html: operatingStatus.statusInfo,
                    }}
                  />
                )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
