import { ParagraphResourceType } from '@/lib/constants/resourceTypes'
import { ParagraphTypes as DrupalParagraph } from '@/types/drupal/paragraph'
import { DrupalResourceByType, FormattedResourceByType } from '@/data/queries'
import { queries } from '@/data/queries'

export const formatParagraph = <T extends ParagraphResourceType>(
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
