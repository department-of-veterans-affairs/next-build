import { ListOfLinkTeasers as FormattedListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'
import {
  FormattedLinkTeaser,
  LinkTeaser as LinkTeaserUnion,
} from '@/components/linkTeaser/formatted-type'
import { LinkTeaser } from '@/components/linkTeaser/template'
import { hashReference } from '@/lib/utils/hashReference'

interface ListOfLinkTeasersProps
  extends Omit<ParagraphComponent<FormattedListOfLinkTeasers>, 'linkTeasers'> {
  linkTeasers?: (ParagraphLinkTeaser | FormattedLinkTeaser)[]
}

export const ListOfLinkTeasers = ({
  id,
  title,
  linkTeasers,
  parentField,
}: ListOfLinkTeasersProps) => (
  <section data-template="paragraphs/list_of_link_teasers" data-entity-id={id}>
    {title && (
      <h2
        id={hashReference(title)}
        className="vads-u-border-color--base-light vads-u-margin--0 vads-u-padding-top--2 vads-u-padding-bottom--0p5"
      >
        {title}
      </h2>
    )}
    <ul className="usa-unstyled-list">
      {linkTeasers?.map((linkTeaser) => (
        <LinkTeaser
          key={linkTeaser.id}
          {...linkTeaser}
          parentField={parentField || linkTeaser.parentField || null}
          componentParams={{
            sectionHeader: title,
          }}
        />
      ))}
    </ul>
  </section>
)
