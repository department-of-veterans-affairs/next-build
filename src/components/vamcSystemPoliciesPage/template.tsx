'use client'
import React, { useEffect } from 'react'
import { VamcSystemPoliciesPage as FormattedVamcSystemPoliciesPage } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { SideNavMenu } from '@/types/formatted/sideNav'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function VamcSystemPoliciesPage({
  title,
  introText,
  topOfPageContent,
  visitationPolicy,
  otherPolicies,
  generalVisitationPolicy,
  bottomOfPageContent,
  lastUpdated,
  // TODO: Add these props when we have the data from the formatter
  // menu,
  // lovellVariant,
  // lovellSwitchPath,
}: FormattedVamcSystemPoliciesPage) {
  // TODO: Populate the side nav data when we add menu to formatter
  // useEffect(() => {
  //   window.sideNav = menu
  // }, [menu])

  return (
    <div
      className="interior"
      id="content"
      data-template="vamc_system_policies_page.drupal.liquid"
    >
      <main className="va-l-detail-page va-facility-page">
        <div className="vads-grid-container">
          {/* TODO: Implement facility sidebar nav component */}
          {/* <nav aria-label="secondary" data-widget-type="side-nav" /> */}

          <div className="vads-grid-row">
            <div className="vads-grid-col-12">
              <article
                aria-labelledby="article-heading"
                role="region"
                className="usa-content"
              >
                {/* TODO: Add Lovell Switcher when we have the data */}
                {/* <LovellSwitcher
                  currentVariant={lovellVariant}
                  switchPath={lovellSwitchPath}
                /> */}

                <h1 id="article-heading">{title}</h1>

                {/* Intro text */}
                {introText && (
                  <div
                    className="va-introtext"
                    dangerouslySetInnerHTML={{ __html: introText }}
                  />
                )}

                <va-on-this-page></va-on-this-page>

                {/* Top of page content (national policies) */}
                {topOfPageContent && (
                  <div dangerouslySetInnerHTML={{ __html: topOfPageContent }} />
                )}

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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generalVisitationPolicy,
                    }}
                  />
                )}

                {/* Bottom of page content (national) */}
                {bottomOfPageContent && (
                  <div
                    dangerouslySetInnerHTML={{ __html: bottomOfPageContent }}
                  />
                )}

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
