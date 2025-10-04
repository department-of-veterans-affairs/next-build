import React from 'react'
import { VamcSystemDetailPage as FormattedVamcSystemDetailPage } from './formatted-type'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'
import { RegionalTopTasks } from '@/components/topTasks/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { Paragraph } from '@/components/paragraph/template'

export function VamcSystemDetailPage({
  entityPath,
  title,
  introText,
  showTableOfContents,
  menu,
  administration,
  vamcEhrSystem,
  vamcSystem,
  featuredContent,
  lovellVariant,
  lovellSwitchPath,
  showLovellSwitcher,
  relatedLinks,
  lastUpdated,
}: LovellStaticPropsResource<FormattedVamcSystemDetailPage>) {
  const isContactPage = entityPath?.includes('contact-us') || false

  return (
    <SideNavLayout menu={menu} data-template="vamc-system-detail-page">
      <article className="usa-content">
        {showLovellSwitcher && (
          <LovellSwitcher
            currentVariant={lovellVariant}
            switchPath={lovellSwitchPath}
          />
        )}

        <h1>{title}</h1>

        {introText && (
          <div className="va-introtext">
            <p>{introText}</p>
          </div>
        )}

        {/* Main action buttons for contact pages */}
        {isContactPage && (
          <div className="usa-grid usa-grid-full vads-u-margin-y--1p5">
            <RegionalTopTasks
              path={vamcSystem.path}
              administration={administration}
              vamcEhrSystem={vamcEhrSystem}
            />
          </div>
        )}

        {/* Alerts */}
        <div>TODO: Alerts component</div>

        {/* Table of contents */}
        {showTableOfContents && <va-on-this-page></va-on-this-page>}

        {/* Featured content */}
        {featuredContent && featuredContent.length > 0 && (
          <div className="feature">
            {featuredContent.map((content) => (
              <Paragraph key={content.id} {...content} />
            ))}
          </div>
        )}

        {/* Main content blocks */}
        <div>TODO: Main content blocks component</div>

        {/* Related links */}
        {relatedLinks && (
          <div className="va-nav-linkslist va-nav-linkslist--related">
            <ListOfLinkTeasers {...relatedLinks} />
          </div>
        )}

        {/* Social links for contact pages */}
        {isContactPage && <div>TODO: Social links component</div>}

        <va-back-to-top></va-back-to-top>
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </SideNavLayout>
  )
}

export default VamcSystemDetailPage
