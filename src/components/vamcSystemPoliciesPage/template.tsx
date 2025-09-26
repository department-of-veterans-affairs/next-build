import React, { useEffect } from 'react'
import { VamcSystemPoliciesPage as FormattedVamcSystemPoliciesPage } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '../wysiwyg/template'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function VamcSystemPoliciesPage({
  title,
  menu,
  introText,
  topOfPageContent,
  visitationPolicy,
  otherPolicies,
  generalVisitationPolicy,
  bottomOfPageContent,
  lastUpdated,
  lovellVariant,
  lovellSwitchPath,
}: FormattedVamcSystemPoliciesPage) {
  // Populate the side nav data for the side nav widget to fill in
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div
      className="interior"
      id="content"
      data-template="vamc_system_policies_page.drupal.liquid"
    >
      <main className="va-l-detail-page va-facility-page">
        <div className="vads-grid-container">
          <nav aria-label="secondary" data-widget-type="side-nav" />

          <div className="vads-grid-row">
            <div className="vads-grid-col-12">
              <article
                aria-labelledby="article-heading"
                role="region"
                className="usa-content"
              >
                <LovellSwitcher
                  currentVariant={lovellVariant}
                  switchPath={lovellSwitchPath}
                />

                <h1 id="article-heading">{title}</h1>

                {/* Intro text */}
                {introText && (
                  <Wysiwyg className="va-introtext" {...introText} />
                )}

                <va-on-this-page></va-on-this-page>

                {/* Top of page content (national policies) */}
                {topOfPageContent && <Wysiwyg {...topOfPageContent} />}

                {/* Local visitation policy */}
                {visitationPolicy && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: visitationPolicy,
                    }}
                  />
                )}

                {/* Other local policies */}
                {otherPolicies && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: otherPolicies,
                    }}
                  />
                )}

                {/* General visitation policy (national) */}
                {generalVisitationPolicy && (
                  <Wysiwyg {...generalVisitationPolicy} />
                )}

                {/* Bottom of page content (national) */}
                {bottomOfPageContent && <Wysiwyg {...bottomOfPageContent} />}

                <va-back-to-top></va-back-to-top>

                {/* Last updated & feedback button */}
                <ContentFooter lastUpdated={lastUpdated} />
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
