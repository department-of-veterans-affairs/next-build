import { Fragment } from 'react';
import { Checklist } from '@/types/formatted/checklist'
import AlertSingle from '@/templates/components/alertSingle'
import { AudienceTopics } from '@/templates/components/audienceTopics'
import { SecondaryButtonGroup } from '@/templates/common/SecondaryButtonGroup'

export function Checklist({
  alert,
  buttons,
  checklist,
  intro,
  repeatButtons,
  tags,
  title
}: Checklist) {
  console.log('tags: ', tags);
  return (
    <main className="va-l-detail-page">
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <div className="usa-content">
            <div data-widget-type="i18-select" />
            <div className="medium-screen:vads-u-border-bottom--2px vads-u-border-color--gray-light medium-screen:vads-u-margin-bottom--3">
              <div className="va-hide-on-print-view" data-widget-type="resources-and-support-search" />
            </div>
            <article className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
              <h1>{title}</h1>
              {intro && <div className="va-introtext" dangerouslySetInnerHTML={{ __html: intro }} />}
              {alert && <AlertSingle {...alert} />}
              {buttons && <SecondaryButtonGroup buttons={buttons} />}
              {checklist?.length && (
                checklist.map((list, index) =>
                  <Fragment key={index}>
                    {list.header && <h2 className="vads-u-margin-bottom--4">{list.header}</h2>}
                    {list.intro && <p>{list.intro}</p>}
                    {list.items && list.items?.length && (
                      <ul className="usa-unstyled-list">
                        {list.items.map((item, index) => (
                          <li
                            className={
                              index < list.items.length - 1 ?
                              `vads-u-margin-bottom--4` :
                            ''}
                            key={index}
                          >
                            <va-checkbox label={item} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Fragment>
                )
              )}
              {repeatButtons && buttons && <SecondaryButtonGroup buttons={buttons} />}
              {tags && <AudienceTopics tags={tags} />}
            </article>
          </div>
        </div>
      </div>
    </main>
  )
}
