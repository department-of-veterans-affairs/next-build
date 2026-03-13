import { AudienceTopic } from '@/components/audienceTopics/formatted-type'
import { getTagsList } from '@/components/audienceTopics/query'
import { ParagraphAudienceTopics } from '@/types/drupal/paragraph'
import { TaxonomyTermLcCategories } from '@/types/drupal/taxonomy_term'
import { BrowseByTopicData } from './formatted-type'

const CATEGORY_LABEL = 'Resources and Support'

/**
 * Formats field_other_categories (taxonomy_term--lc_categories) to AudienceTopic format.
 * Matches content-build getOtherCategoriesList filter.
 */
function formatOtherCategories(
  categories: TaxonomyTermLcCategories[] | null | undefined
): AudienceTopic[] {
  if (!categories?.length) return []
  return categories.map((cat) => ({
    id: cat.id,
    href: cat.path?.alias ?? `/${cat.id}`,
    name: cat.name ?? '',
    categoryLabel: CATEGORY_LABEL,
  }))
}

/**
 * Formats raw Drupal field_tags and field_other_categories into BrowseByTopicData.
 * Returns null when both tags and categories are empty.
 */
export function formatBrowseByTopicData(
  tagsField: ParagraphAudienceTopics | null | undefined,
  categoriesField: TaxonomyTermLcCategories[] | null | undefined
): BrowseByTopicData | null {
  const tags = getTagsList(tagsField) ?? []
  const categories = formatOtherCategories(categoriesField)
  if (tags.length === 0 && categories.length === 0) return null
  return { tags, categories }
}
