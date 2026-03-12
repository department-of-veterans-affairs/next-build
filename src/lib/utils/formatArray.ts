/**
 * Formats an array of items, handling null input and filtering out invalid results.
 *
 * 1. If the array value is null/undefined, returns null
 * 2. Formats each item and filters out null values
 * 3. If the resulting filtered array is empty, returns null
 */
export function formatArray<T, R>(
  arr: T[] | null | undefined,
  formatSingle: (item: T) => R | null
): R[] | null {
  if (arr == null) return null
  const result = arr.map(formatSingle).filter((x): x is R => x != null)
  return result.length === 0 ? null : result
}
