import { VamcOperatingStatusAndAlerts as FormattedVamcOperatingStatusAndAlerts } from './formatted-type'
import { ContentFooter } from '../contentFooter/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'
import { OperatingStatuses } from './OperatingStatuses'
import { SituationUpdates } from './SituationUpdates'

export function VamcOperatingStatusAndAlerts({
  facilityName,
  menu,
  situationUpdates,
  operatingStatuses,
}: FormattedVamcOperatingStatusAndAlerts) {
  const dateFormat = 'EEEE, MMM d, h:mm aaaa'
  return (
    <SideNavLayout menu={menu}>
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
        {situationUpdates && <SituationUpdates {...{ situationUpdates }} />}
        {operatingStatuses && <OperatingStatuses {...{ operatingStatuses }} />}
        <div>TODO: add fieldLink or fieldOperatingStatusEmergInf</div>
        <ContentFooter />
      </article>
    </SideNavLayout>
  )
}
