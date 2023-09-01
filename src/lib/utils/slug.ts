/**
 * If a slug includes a page number (`page-{n}`) in the last segment,
 * it is a generated path for paging, and Drupal will not know about it.
 * The page number needs to be extracted and the page segment needs to
 * be removed from the slug to generate the path.
 *
 * Ex:
 * input: [
 *  'minneapolis-health-care',
 *  'stories',
 *  'page-2'
 * ]
 * output: [
 *  'minneapolis-health-care/stories',
 *  2
 * ]
 *
 *
 * In all other cases, the path is formed simply by using all segments
 * from the slug, and the page number is returned as undefined.
 *
 * Ex:
 * input: [
 *  'minneapolis-health-care'
 *  'stories',
 *  'some-story-title'
 * ]
 * output: [
 *  'minneapolis-health-care/stories/some-story-title`,
 *  undefined
 * ]
 */
export function getPathAndPageNumberFromSlug(
  slug: string | string[]
): [string, number] {
  if (slug === undefined || slug?.length === 0) {
    return ['/', undefined]
  }

  if (typeof slug === 'string') {
    return [`/${slug}`, undefined]
  }

  const matches = slug[slug.length - 1].match(/^page-(\d)+$/)
  if (matches) {
    const pageNumber = matches ? matches?.[1] : undefined
    return [
      slug.slice(0, -1).join('/'),
      pageNumber ? parseInt(pageNumber) : undefined,
    ]
  }

  return [slug.join('/'), undefined]
}
