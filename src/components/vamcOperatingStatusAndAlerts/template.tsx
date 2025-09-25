import { VamcOperatingStatusAndAlerts as FormattedVamcOperatingStatusAndAlerts } from './formatted-type'
import { useEffect } from 'react'
import { ContentFooter } from '../contentFooter/template'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { format, toZonedTime } from 'date-fns-tz'
import { tzName } from '@date-fns/tz'
// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function VamcOperatingStatusAndAlerts({
  facilityName,
  menu,
  situationUpdates,
  operatingStatuses,
}: FormattedVamcOperatingStatusAndAlerts) {
  useEffect(() => {
    window.sideNav = menu
  }, [menu])
  const dateFormat = 'EEEE, MMM d, h:mm aaaa'
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
    <div className="interior" id="content">
      <main className="va-l-detail-page va-facility-page">
        <div className="vads-grid-container">
          <nav aria-label="secondary" data-widget-type="side-nav" />
          <div className="vads-grid-row">
            <div className="vads-grid-col-12">
              <article className="usa-content">
                <div>TODO: add Lovell switch</div>
                <h1 className="vads-u-margin-bottom--2">Operating status</h1>
                <div className="va-introtext vads-u-margin-bottom--0">
                  {`${facilityName} facility operating statuses and emergency information.`}
                </div>
                <div>
                  TODO: add conditional fieldLinkFacilityEmergList action link
                </div>
                <section className="table-of-contents vads-u-margin-bottom--5">
                  <va-on-this-page />
                </section>
                {situationUpdates && (
                  <section
                    id="situation-updates"
                    data-testid="situation-updates-wrapper"
                  >
                    <h2 id="situation-updates-and-information">
                      Situation updates and information
                    </h2>
                    {situationUpdates.map((situationUpdate, situationIndex) => (
                      <div key={situationIndex}>
                        {situationUpdate.updates.map((update, updateIndex) => {
                          const zonedDate = toZonedTime(
                            update.dateTime,
                            update.timezone
                          )
                          const formattedTimeZone = tzName(
                            update.timezone,
                            new Date(zonedDate),
                            'shortGeneric'
                          )
                          const dateTimeString = `${format(zonedDate, dateFormat, { timeZone: update.timezone })} ${formattedTimeZone}`
                          return (
                            <va-card
                              background
                              key={updateIndex}
                              class="vads-u-padding-y--1p5 vads-u-margin-top--1p5"
                              data-testid={`situation-${situationIndex + 1}-update-${updateIndex + 1}`}
                            >
                              <h3 className="vads-u-margin-top--0">
                                Situation update
                              </h3>
                              <h4
                                data-testid={`situation-${situationIndex + 1}-update-${updateIndex + 1}-date`}
                                className="vads-u-margin-top--1 vads-u-margin-bottom--2"
                              >
                                {dateTimeString}
                              </h4>
                              <div
                                data-testid={`situation-${situationIndex + 1}-update-${updateIndex + 1}-update`}
                                dangerouslySetInnerHTML={{
                                  __html: update.updateText,
                                }}
                              />
                            </va-card>
                          )
                        })}
                        {situationUpdate.info && (
                          <>
                            <h3 className="vads-u-margin-top--3">
                              Situation info
                            </h3>
                            <div
                              data-testid={`situation-${situationIndex + 1}-info`}
                              dangerouslySetInnerHTML={{
                                __html: situationUpdate.info,
                              }}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </section>
                )}
                {operatingStatuses && (
                  <section className="clearfix" id="operating-statuses">
                    <h2 id="facility-operating-statuses">
                      Facility operating statuses
                    </h2>
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
                )}
                <div>TODO: add fieldFacilityOperatingStatus</div>
                <div>TODO: add fieldLink or fieldOperatingStatusEmergInf</div>
                <ContentFooter />
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
