import { ListOfLinkTeasers as FormattedListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { LinkTeaser } from '@/components/linkTeaser/template'
import { hashReference } from '@/lib/utils/hashReference'

export const ListOfLinkTeasers = ({
  id,
  title,
  linkTeasers,
  parentField,
}: ParagraphComponent<FormattedListOfLinkTeasers>) => {
  const isFieldSpokes = parentField === 'field_spokes'

  return (
    <section
      data-template="paragraphs/list_of_link_teasers"
      data-entity-id={id}
    >
      {title && (
        <h2
          id={hashReference(title)}
          className={
            isFieldSpokes
              ? ''
              : 'vads-u-border-bottom--1px vads-u-border-color--base-light vads-u-margin--0 vads-u-padding-top--2 vads-u-padding-bottom--0p5'
          }
        >
          {title}
        </h2>
      )}
      <ul className={'usa-unstyled-list'}>
        {linkTeasers.map((linkTeaser) => (
          <LinkTeaser
            key={linkTeaser.id}
            {...linkTeaser}
            componentParams={{
              sectionHeader: title,
            }}
            parentField={parentField}
          />
        ))}
      </ul>
    </section>
  )
}
