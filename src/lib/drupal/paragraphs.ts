import { ParagraphTypes as DrupalParagraph } from '@/types/drupal/paragraph'
import {
  DrupalResourceByType,
  FormattedResourceByType,
} from '@/lib/drupal/queries'
import { queries, FormattableParagraphResourceType } from '@/lib/drupal/queries'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'

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
 * `src/lib/drupal/queries.ts`)
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

type EntityFetchedParagraph = {
  type: string
  bundle: string
  target_id?: string
}
function isEntityFetchedParagraph(
  paragraph: unknown
): paragraph is EntityFetchedParagraph {
  return (
    paragraph != null &&
    typeof paragraph === 'object' &&
    (paragraph as EntityFetchedParagraph).type === 'paragraph' &&
    'bundle' in paragraph
  )
}

type EntityFetchedRoot = {
  target_type: string
  target_id?: string
  fetched_bundle: string
  fetched: Record<string, unknown>
}
function isEntityFetchedRoot(root: unknown): root is EntityFetchedRoot {
  return (
    root != null &&
    typeof root === 'object' &&
    'target_type' in root &&
    'fetched_bundle' in root &&
    'fetched' in root
  )
}

const EXPECTED_ARRAY_FIELDS = [
  'field_links',
  'field_audience_beneficiares',
  'field_non_beneficiares',
  'field_topics',
]

const POSSIBLY_EMPTY_FIELDS = ['field_alert_block_reference']

/**
 * Recursively converts a paragraph that was fetched using [entity_field_fetch](https://www.drupal.org/project/entity_field_fetch)
 * to a normal paragraph that we'd expect from the base Drupal API.
 */
export function normalizeEntityFetchedParagraphs<T extends DrupalParagraph>(
  paragraph: EntityFetchedRoot | EntityFetchedParagraph
): T {
  if (isEntityFetchedRoot(paragraph)) {
    paragraph = {
      type: paragraph.target_type,
      bundle: paragraph.fetched_bundle,
      // Note, I think if this value is actually undefined, it will break the static build
      // because it will try to serialize undefined, which is not allowed. I actually want
      // to find out whether target_id can actually be undefined, however, so I want to
      // keep this in. If we don't have any issues, we might be able to update all the
      // individual CC types to make it a required field.
      target_id: paragraph.target_id,
      ...paragraph.fetched,
    }
  } else if (!isEntityFetchedParagraph(paragraph)) {
    return paragraph
  }

  const convertProperty = ([key, value]) => {
    if (Array.isArray(value)) {
      const firstItem = value[0]

      // Peak at the first value to see if this is an array of entity_field_fetch
      // paragraphs. If so, recursively convert them to normal paragraphs.
      if (isEntityFetchedParagraph(firstItem)) {
        return [key, value.map(normalizeEntityFetchedParagraphs)]
      }

      // It's most likely one of the messed-up entity_field_fetch fields that we're
      // looking for. These field values are being converted to arrays by
      // entity_field_fetch, but we want to convert them back to single values by just
      // grabbing the first value.
      if (!EXPECTED_ARRAY_FIELDS.includes(key) && value.length === 1) {
        // Even weirder still is that some fields that are normally just strings behave
        // like `FieldFormattedText` objects except they only have a `value` property.
        // We need to handle that here.
        if (
          firstItem.value &&
          !('format' in firstItem) &&
          !('processed' in firstItem)
        ) {
          return [key, firstItem.value]
        }
        return [key, firstItem]
      }

      // It seems that sometimes null values are converted to an empty array, so in that
      // case we want to convert it back to null.
      if (POSSIBLY_EMPTY_FIELDS.includes(key) && value.length === 0) {
        return [key, null]
      }
    }
    return [key, value]
  }

  const { type, bundle, target_id, ...properties } = paragraph
  return {
    type: `${type}--${bundle}`,
    id: target_id,
    ...Object.fromEntries(Object.entries(properties).map(convertProperty)),
  }
}
