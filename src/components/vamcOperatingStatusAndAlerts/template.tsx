import { VamcOperatingStatusAndAlerts as FormattedVamcOperatingStatusAndAlerts } from './formatted-type'
import { ContentFooter } from '../contentFooter/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'
import { OperatingStatuses } from './OperatingStatuses'
import { SituationUpdates } from './SituationUpdates'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'

export function VamcOperatingStatusAndAlerts({
  facilityName,
  menu,
  situationUpdates,
  operatingStatuses,
  emergencyInformation,
  localEmergencyLinks,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedVamcOperatingStatusAndAlerts>) {
  const dateFormat = 'EEEE, MMM d, h:mm aaaa'
  return (
    <SideNavLayout menu={menu}>
      <article className="usa-content">
        <LovellSwitcher
          currentVariant={lovellVariant}
          switchPath={lovellSwitchPath}
        />
        <h1 className="vads-u-margin-bottom--2">Operating status</h1>
        <div className="va-introtext vads-u-margin-bottom--0">
          {`${facilityName} facility operating statuses and emergency information.`}
        </div>
        <section className="table-of-contents vads-u-margin-bottom--5">
          <va-on-this-page />
        </section>
        {situationUpdates && <SituationUpdates {...{ situationUpdates }} />}
        {operatingStatuses && <OperatingStatuses {...{ operatingStatuses }} />}
        {(emergencyInformation || localEmergencyLinks) && (
          <section id="emergency-resources" data-testid="emergency-resources">
            <h2 id="emergency-information">Emergency information</h2>
            {emergencyInformation && (
              <div
                data-testid="emergency-information"
                dangerouslySetInnerHTML={{
                  __html: emergencyInformation,
                }}
              />
            )}
            {localEmergencyLinks && (
              <>
                <h3
                  id="local-emergency-resources"
                  className="vads-u-margin-top--3 vads-u-margin-bottom--2"
                  data-testid="local-emergency-resources"
                >
                  Local emergency resources
                </h3>
                {localEmergencyLinks.map((localEmergencyLink, index) => (
                  <p key={index}>
                    <va-link
                      href={localEmergencyLink.url}
                      text={localEmergencyLink.label}
                    />
                  </p>
                ))}
              </>
            )}
          </section>
        )}
      </article>
      <ContentFooter />
    </SideNavLayout>
  )
}
