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

        {showTableOfContents && (
          <>
            {/* I want the va-on-this-page to still trigger a lazy load of the custom element */}
            <div style={{ display: 'none' }}>
              <va-on-this-page></va-on-this-page>
            </div>
            <nav aria-labelledby="on-this-page" className="va-on-this-page-wrapper">
              <h2 id="on-this-page">On this page</h2>
              <ul>
                <li>
                  <a href="#how-much-of-the-full-benefit-rate-you-can-get">
                    <va-icon className="hydrated"></va-icon>
                    <span>How much of the full benefit rate you can get</span>
                  </a>
                </li>
                <li>
                  <a href="#full-rates-for-school-and-training-programs">
                    <va-icon className="hydrated"></va-icon>
                    <span>Full rates for school and training programs</span>
                  </a>
                </li>
                <li>
                  <a href="#benefit-payments-for-on-the-job-training-and-apprenticeships">
                    <va-icon className="hydrated"></va-icon>
                    <span>Benefit payments for on-the-job training and apprenticeships</span>
                  </a>
                </li>
                <li>
                  <a href="#full-rates-for-testing-fees">
                    <va-icon className="hydrated"></va-icon>
                    <span>Full rates for testing fees</span>
                  </a>
                </li>
                <li>
                  <a href="#how-to-contact-us-if-you-have-">
                    <va-icon className="hydrated"></va-icon>
                    <span>How to contact us if you have questions</span>
                  </a>
                </li>
                <li>
                  <a href="#more-information-about-education-benefits">
                    <va-icon className="hydrated"></va-icon>
                    <span>More information about education benefits</span>
                  </a>
                </li>
              </ul>
            </nav>
          </>
        )}

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

        {/* I want the va-back-to-top to still trigger a lazy load of the custom element */}
        <div style={{ display: 'none' }}>
          <va-back-to-top></va-back-to-top>
        </div>
        <span id="ds-back-to-top" className="va-back-to-top-wrapper">
          <span className="reveal-point"></span>
          <div>
            <a href="#ds-back-to-top">
              <span>
                <va-icon className="hydrated"></va-icon>
                <span className="sr-only">Back to top</span>
                <span className="text">Back to top</span>
              </span>
            </a>
          </div>
        </span>
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </SideNavLayout>
  )
}
