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
}: FormattedBenefitsDetailPage) {
  return (
    <div id="content" className="interior" data-template="benefits-detail-page">
      <main className="va-l-detail-page">
        <div className="usa-grid usa-grid-full">
          <div className="usa-width-three-fourths">
            <article className="usa-content vads-u-padding-bottom--0">
              {/* i18n language selector widget placeholder */}
              <div data-widget-type="i18-select"></div>

              {/* Page title */}
              <h1>{title}</h1>

              {/* Intro text */}
              {introText && (
                <div
                  className="va-introtext"
                  dangerouslySetInnerHTML={{ __html: introText }}
                />
              )}

              {/* Alert */}
              {alert && <AlertBlock {...alert} />}

              {/* Table of contents */}
              {showTableOfContents && <va-on-this-page></va-on-this-page>}

              {/* Featured content */}
              <div>TODO: Featured content component</div>

              {/* Main content blocks */}
              <div>TODO: Main content blocks component</div>

              {/* Related links */}
              {relatedLinks && (
                <div className="row">
                  <div className="usa-content">
                    <aside className="va-nav-linkslist va-nav-linkslist--related">
                      <ListOfLinkTeasers {...relatedLinks} />
                    </aside>
                  </div>
                </div>
              )}

              <va-back-to-top></va-back-to-top>
              <ContentFooter lastUpdated={lastUpdated} />
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}
