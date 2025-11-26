import React from 'react'
import { BenefitsDetailPage as FormattedBenefitsDetailPage } from './formatted-type'
import { ParagraphList } from '@/components/paragraph/template'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { AlertBlock } from '@/components/alertBlock/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'

export function BenefitsDetailPage({
  title,
  introText,
  alert,
  showTableOfContents,
  featuredContent,
  mainContent,
  relatedLinks,
  lastUpdated,
  menu,
  menuIcon,
  entityPath,
}: FormattedBenefitsDetailPage) {
  return (
    <SideNavLayout
      menu={menu}
      menuIcon={menuIcon}
      useWidget={false}
      className="va-l-detail-page"
    >
      <article className="usa-content vads-u-padding-bottom--0">
        <div data-widget-type="i18-select" />

        <h1>{title}</h1>

        {introText && (
          <div
            className="va-introtext"
            dangerouslySetInnerHTML={{ __html: introText }}
          />
        )}

        {alert && <AlertBlock {...alert} />}

        {showTableOfContents && <va-on-this-page></va-on-this-page>}

        {featuredContent && featuredContent.length > 0 && (
          <div className="feature">
            <ParagraphList paragraphs={featuredContent} />
          </div>
        )}

        <ParagraphList paragraphs={mainContent} />

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
