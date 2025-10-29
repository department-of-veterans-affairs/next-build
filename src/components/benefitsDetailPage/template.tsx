import React from 'react'
import { BenefitsDetailPage as FormattedBenefitsDetailPage } from './formatted-type'
// import { Paragraph } from '@/components/paragraph/template'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { AlertBlock } from '@/components/alertBlock/template'
import { ContentFooter } from '../contentFooter/template'

export function BenefitsDetailPage({
  title,
  introText,
  alert,
  showTableOfContents,
  // featuredContent,
  // contentBlock,
  relatedLinks,
  lastUpdated,
  menu,
  menuIcon,
  entityPath,
}: FormattedBenefitsDetailPage) {
  return (
    <div
      className="usa-grid usa-grid-full"
      data-template="benefits-detail-page"
    >
      <div className="usa-width-three-fourths">
        <article className="usa-content vads-u-padding-bottom--0">
          <h1>{title}</h1>

          {introText && (
            <div
              className="va-introtext"
              dangerouslySetInnerHTML={{ __html: introText }}
            />
          )}

          {alert && <AlertBlock {...alert} />}

          {showTableOfContents && <va-on-this-page></va-on-this-page>}

          {/* Featured content */}
          <div>TODO: Featured content component</div>

          {/* Main content blocks */}
          <div>TODO: Main content blocks component</div>

          {relatedLinks && (
            <div className="va-nav-linkslist va-nav-linkslist--related">
              <ListOfLinkTeasers {...relatedLinks} />
            </div>
          )}

          <va-back-to-top></va-back-to-top>
          <ContentFooter lastUpdated={lastUpdated} />
        </article>
      </div>
    </div>
  )
}
