import { ParagraphTypes as DrupalParagraph } from '@/types/drupal/paragraph'
import { DrupalResourceByType, FormattedResourceByType } from '@/data/queries'
import { queries, FormattableParagraphResourceType } from '@/data/queries'

/**
 * An abstraction for calling `queries.formatData` that removes
 * the need to explicitly pass the paragraph type as a parameter,
 * since that property should always be available on the paragraph
 * itself.
 *
 * This allows the caller to format an embedded paragraph without
 * needing to know anything about the paragraph:
 *
 * `formatParagraph(paragraph)` //paragraph could be any type
 *
 * rather than
 *
 * `queries.formatData('paragraph--alert', paragraph)` // we would not know the type
 *
 * Notably, we could do this:
 *
 * `queries.formatData(paragraph.type, paragraph)`
 *
 * But that would require some type assertions, and so this function
 * takes care of that.
 *
 * Note: FormattableParagraphResourceType indicates that the passed-in
 * paragraph must be one that has a `formatter` (defined in
 * `src/data/queries/index.ts`)
 *
 *
 * @param paragraph
 * @returns
 */
export const formatParagraph = <T extends FormattableParagraphResourceType>(
  paragraph: DrupalParagraph
): FormattedResourceByType<T> => {
  if (!paragraph) {
    return null
  }

  try {
    return queries.formatData(
      paragraph.type as T,
      paragraph as DrupalResourceByType<T>
    )
  } catch (err) {
    return null
  }
}
