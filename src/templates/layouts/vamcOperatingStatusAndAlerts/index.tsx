import { useEffect } from "react"
import { ContentFooter } from "@/templates/common/contentFooter"
import { SideNavMenu } from '@/types/formatted/sideNav'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

type VamcOperatingStatusAndAlertsProps = {
  facilityName: string
  menu?: SideNavMenu
}

export function VamcOperatingStatusAndAlerts({
  facilityName, menu
}: VamcOperatingStatusAndAlertsProps) {
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
            <div>TODO: add conditional fieldLinkFacilityEmergList action link</div>
              <section className="table-of-contents vads-u-margin-bottom--5">
                <va-on-this-page />
              </section>

              <div>TODO: add fieldSituationUpdates</div>

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
