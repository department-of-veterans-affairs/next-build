import React from 'react'
import { VamcSystemPoliciesPage as FormattedVamcSystemPoliciesPage } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { Wysiwyg } from '../wysiwyg/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'

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
  return (
    <SideNavLayout menu={menu} data-template="vamc_system_policies_page">
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
        {introText && <Wysiwyg className="va-introtext" {...introText} />}

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
        {generalVisitationPolicy && <Wysiwyg {...generalVisitationPolicy} />}

        {/* Bottom of page content (national) */}
        {bottomOfPageContent && <Wysiwyg {...bottomOfPageContent} />}

        <va-back-to-top></va-back-to-top>

        {/* Last updated & feedback button */}
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </SideNavLayout>
  )
}
