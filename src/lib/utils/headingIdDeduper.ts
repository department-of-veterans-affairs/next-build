/**
 * Creates a heading ID deduplicator function that can be called multiple times
 * to deduplicate heading IDs across multiple HTML strings while maintaining
 * state through a closure.
 *
 * Create a new instance of the deduplicator in the `formatter()` function and
 * call it for each HTML string that will get rendered as dangerously-set HTML
 * (e.g. WYSIWYG content).
 *
 * @param initialIds - Initial IDs to populate the deduplicator with. Pass
 * in the IDs of any headings that are already hard-coded in the template.
 * @returns A function that deduplicates heading IDs in HTML content
 */
export const getHeadingIdDeduper = (...initialIds: string[]) => {
  const usedIds = new Set<string>(initialIds)

  return (content: string): string => {
    if (!content) return content

    return content.replace(
      /(<h2[^>]*\sid=["']?)([^"'\s>]+)(["']?[^>]*>)/gi,
      (_match, beforeId, id, afterId) => {
        let newId = id
        let counter = 1

        // Keep incrementing the counter until we find a unique ID
        while (usedIds.has(newId)) {
          newId = `${id}-${counter}`
          counter++
        }

        // Add the new ID to our set of used IDs
        usedIds.add(newId)

        return `${beforeId}${newId}${afterId}`
      }
    )
  }
}
