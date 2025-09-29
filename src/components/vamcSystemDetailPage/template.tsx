import React, { useEffect } from 'react'
import { VamcSystemDetailPage as FormattedVamcSystemDetailPage } from './formatted-type'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '../lovellSwitcher/template'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/template'
import { ContentFooter } from '../contentFooter/template'

export function VamcSystemDetailPage({
  entityPath,
  title,
  introText,
  showTableOfContents,
  menu,
  lovellVariant,
  lovellSwitchPath,
  relatedLinks,
  lastUpdated,
}: LovellStaticPropsResource<FormattedVamcSystemDetailPage>) {
  const isContactPage = entityPath?.includes('contact-us') || false

  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div
      className="vads-grid-container"
      data-template="vamc_system_detail_page"
    >
      {/* Nav data filled in by a separate script from `window.sideNav` */}
      <nav aria-label="secondary" data-widget-type="side-nav" />
      <div className="vads-grid-row">
        <div className="vads-grid-col-12">
          <article
            aria-labelledby="article-heading"
            role="region"
            className="usa-content"
            data-template="vamc-system-detail-page"
          >
            {/* TODO: Add Lovell switcher in the right scenarios */}
            {/* <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            /> */}

            <h1 id="article-heading">{title}</h1>

            {introText && (
              <div className="va-introtext">
                <p>{introText}</p>
              </div>
            )}

            {/* Main action buttons for contact pages */}
            {isContactPage && (
              <div className="usa-grid usa-grid-full vads-u-margin-y--1p5">
                <div>TODO: Main action buttons</div>
              </div>
            )}

            {/* Alerts */}
            <div>TODO: Alerts component</div>

            {/* Table of contents */}
            {showTableOfContents && <va-on-this-page></va-on-this-page>}

            {/* Featured content */}
            <div>TODO: Featured content component</div>

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
        </div>
      </div>
    </div>
  )
}

export default VamcSystemDetailPage
