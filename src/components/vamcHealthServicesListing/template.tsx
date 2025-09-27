import { VamcHealthServicesListing as FormattedVamcHealthServicesListing } from './formatted-type'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { FacilityTopTasks } from '@/components/topTasks/template'
import { FeaturedContent } from '@/components/featuredContent/template'
import { ContentFooter } from '../contentFooter/template'
import { HealthServiceGroup } from './HealthServiceGroup'
import { SideNavLayout } from '@/components/sideNavLayout/template'

export function VamcHealthServicesListing({
  title,
  introText,
  lovellVariant,
  lovellSwitchPath,
  path,
  administration,
  vamcEhrSystem,
  menu,
  featuredContent,
  systemTitle,
  healthServiceGroups,
}: FormattedVamcHealthServicesListing) {
  // Extract the region base path from the full path (same as healthCareLocalFacility)
  const regionBasePath = path ? path.split('/')[1] : ''

  return (
    <main className="va-l-detail-page va-facility-page">
      <SideNavLayout menu={menu}>
        <article className="usa-content">
          <LovellSwitcher
            currentVariant={lovellVariant}
            switchPath={lovellSwitchPath}
          />

          <h1 className="vads-u-margin-bottom--1 tablet:vads-u-margin-bottom--2">
            {title}
          </h1>

          <div className="va-introtext">
            {introText && <p id="office-events-description">{introText}</p>}
          </div>

          {/* Top Task links */}
          {path && (
            <div>
              <FacilityTopTasks
                path={regionBasePath}
                administration={administration}
                vamcEhrSystem={vamcEhrSystem}
              />
            </div>
          )}

          <va-on-this-page />

          {/* Featured Content Section - conditional on fieldFeaturedContentHealthser */}
          {featuredContent && featuredContent.length > 0 && (
            <section id="featured-services">
              <h2 id="in-the-spotlight">In the spotlight</h2>
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between tablet:vads-u-flex-direction--row vads-u-margin-bottom--4">
                {featuredContent.map((item) => (
                  <FeaturedContent
                    key={item.id}
                    title={item.title}
                    description={item.summary}
                    link={{
                      id: item.id,
                      url: item.uri,
                      label: 'Read more',
                    }}
                    id={item.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Health Services Listing by type */}
          {healthServiceGroups.map((group) => (
            <HealthServiceGroup
              key={group.typeOfCare}
              group={group}
              systemTitle={systemTitle}
            />
          ))}

          {/* Fallback for empty service list */}
          {healthServiceGroups.length === 0 && (
            <div className="no-services-message">
              <p>No health services at this time.</p>
            </div>
          )}

          <va-back-to-top />
          <ContentFooter />
        </article>
      </SideNavLayout>
    </main>
  )
}
