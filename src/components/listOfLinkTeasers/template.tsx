import { ListOfLinkTeasers as FormattedListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { LinkTeaser } from '@/components/linkTeaser/template'
import { hashReference } from '@/lib/utils/hashReference'

/**
 * @name ListOfLinkTeasers
 * @param {string} title The title to show above the list of link teasers
 * @param {LinkTeaser[]} linkTeasers The list of link teasers to show. These can
 * be from the `ListOfLinkTeasers` paragraph, or just a field with `LinkTeaser[]`.
 */
export const ListOfLinkTeasers = ({
  title,
  linkTeasers,
}: Pick<FormattedListOfLinkTeasers, 'title' | 'linkTeasers'>) => (
  <section>
    {title && (
      <h2
        id={hashReference(title)}
        className="vads-u-border-bottom--1px vads-u-border-color--base-light vads-u-margin--0 vads-u-padding-top--2 vads-u-padding-bottom--0p5"
      >
        {title}
      </h2>
    )}
    <ul className="usa-unstyled-list">
      {linkTeasers.map((linkTeaser) => (
        <LinkTeaser
          key={linkTeaser.id}
          {...linkTeaser}
          componentParams={{
            sectionHeader: title,
          }}
        />
      ))}
    </ul>
  </section>
)
