import { OperatingStatus as FormattedOperatingStatus } from './formatted-type'

interface OperatingStatusesProps {
  operatingStatuses: FormattedOperatingStatus[]
}
export function OperatingStatuses({
  operatingStatuses,
}: OperatingStatusesProps) {
  const formatStatus = (status) => {
    switch (status) {
      case 'notice':
        return (
          <va-alert slim status="info" visible>
            Facility notice
          </va-alert>
        )
      case 'normal':
        return (
          <span className="operating-status vads-u-margin-top--1p5 vads-u-display--block">
            Normal services and hours
          </span>
        )
      case 'limited':
        return (
          <va-alert slim status="info" visible>
            Limited services and hours
          </va-alert>
        )
      case 'closed':
        return (
          <va-alert slim status="warning" visible>
            Facility Closed
          </va-alert>
        )
      case 'temporary_closure':
        return (
          <va-alert slim status="warning" visible>
            Temporary facility closure
          </va-alert>
        )
      case 'temporary_location':
        return (
          <va-alert slim status="warning" visible>
            Temporary location
          </va-alert>
        )
      case 'virtual_care':
        return (
          <va-alert slim status="warning" visible>
            Virtual care only
          </va-alert>
        )
      case 'coming_soon':
        return (
          <va-alert slim status="warning" visible>
            Coming soon
          </va-alert>
        )
      default:
        return ''
    }
  }
  return (
    <section className="clearfix" id="operating-statuses">
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
                  <p className="vads-u-margin-bottom--0">
                    {operatingStatus.statusInfo}
                  </p>
                )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
