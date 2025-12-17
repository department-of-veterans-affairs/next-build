import React from 'react'
import { OutreachHub as FormattedOutreachHub } from './formatted-type'
import { SideNavLayout } from '@/components/sideNavLayout/template'
import { ContentFooter } from '@/components/contentFooter/template'

export function OutreachHub({
  title,
  description,
  body,
  menu,
  lastUpdated,
}: FormattedOutreachHub) {
  return (
    <SideNavLayout
      menu={menu}
      className="va-l-detail-page"
      data-template="outreach-hub"
    >
      <article
        aria-labelledby="article-heading"
        className="vads-l-grid-container--full"
        role="region"
      >
        <div className="vads-l-grid-container--full">
          <h1 id="article-heading">{title}</h1>
          <div className="vads-l-grid-container--full">
            {description && (
              <div className="va-introtext">
                <p id="office-main-description">{description}</p>
              </div>
            )}
            {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
          </div>
        </div>
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </SideNavLayout>
  )
}

export default OutreachHub
