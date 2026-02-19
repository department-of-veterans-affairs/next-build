import React from 'react'
import { VamcSystemDetailPage as FormattedVamcSystemDetailPage } from './formatted-type'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'
import { RegionalTopTasks } from '@/components/topTasks/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { Paragraph, ParagraphList } from '@/components/paragraph/template'

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
  mainContent,
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
          <RegionalTopTasks
            path={vamcSystem.path}
            administration={administration}
            vamcEhrSystem={vamcEhrSystem}
          />
        )}

        {/* Table of contents */}
        {showTableOfContents && <va-on-this-page></va-on-this-page>}

        {/* Featured content */}
        {featuredContent && featuredContent.length > 0 && (
          <div className="feature">
            <ParagraphList paragraphs={featuredContent} />
          </div>
        )}

        {/* Main content blocks */}
        <ParagraphList paragraphs={mainContent} />

        {/* Related links */}
        {relatedLinks && (
          <div className="va-nav-linkslist va-nav-linkslist--related">
            <ListOfLinkTeasers {...relatedLinks} />
          </div>
        )}

        <va-back-to-top></va-back-to-top>
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </SideNavLayout>
  )
}

export default VamcSystemDetailPage
