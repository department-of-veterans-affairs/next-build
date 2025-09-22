import { VamcOperatingStatusAndAlerts as FormattedVamcOperatingStatusAndAlerts } from './formatted-type'
import { useEffect } from 'react'
import { ContentFooter } from '../contentFooter/template'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { format, toZonedTime } from 'date-fns-tz'
// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function VamcOperatingStatusAndAlerts({
  facilityName,
  menu,
  situationUpdates,
}: FormattedVamcOperatingStatusAndAlerts) {
  useEffect(() => {
    window.sideNav = menu
  }, [menu])
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
                    {situationUpdates.map((situationUpdate, index) => (
                      <div key={index}>
                        {situationUpdate.updates.map((update, index) => (
                          <va-card
                            background
                            key={index}
                            class="vads-u-padding-y--1p5 vads-u-margin-top--1p5"
                            data-testid={`situation-update-${index + 1}`}
                          >
                            <h3 className="vads-u-margin-top--0">
                              Situation update
                            </h3>
                            <h4
                              data-testid={`situation-update-${index + 1}-date`}
                            >
                              {format(
                                toZonedTime(update.dateTime, update.timezone),
                                'EEEE, MMM d, h:mm aaaa zzz',
                                { timeZone: update.timezone }
                              )}
                            </h4>
                            <div
                              data-testid={`situation-update-${index + 1}-update`}
                              dangerouslySetInnerHTML={{
                                __html: update.updateText,
                              }}
                            />
                          </va-card>
                        ))}
                        {situationUpdate.info && (
                          <>
                            <h3 className="vads-u-margin-top--3">
                              Situation info
                            </h3>
                            <div
                              data-testid={`situation-update-${index + 1}-info`}
                              className="vads-u-margin-bottom--0"
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
