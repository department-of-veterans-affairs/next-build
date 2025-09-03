import { ListOfLinkTeasers as FormattedListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { LinkTeaser } from '@/components/linkTeaser/template'
import { hashReference } from '@/lib/utils/hashReference'

export const ListOfLinkTeasers = ({
  id,
  title,
  linkTeasers,
}: ParagraphComponent<FormattedListOfLinkTeasers>) => (
  <section data-template="paragraphs/list_of_link_teasers" data-entity-id={id}>
    {title && (
      <h2
        id={hashReference(title)}
        className="va-nav-linkslist-heading"
        tabIndex={-1}
      >
        {title}
      </h2>
    )}
    <ul className="va-nav-linkslist-list">
      {linkTeasers.map((linkTeaser) => (
        <LinkTeaser
          key={linkTeaser.id}
          {...linkTeaser}
          componentParams={{
            sectionHeader: title,
            boldTitle: false,
          }}
        />
      ))}
    </ul>
  </section>
)
