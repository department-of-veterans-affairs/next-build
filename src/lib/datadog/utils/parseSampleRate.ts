/**
 * Parse a sample rate string but return undefined if the string is not a valid number
 * so we can easily fall back to a default sample rate. Previously we fell back with an
 * OR operator (`||`), but that didn't account for a zero value.
 */
export function parseSampleRate(
  rateString: string | undefined
): number | undefined {
  const rate = parseFloat(rateString)
  if (isNaN(rate)) {
    return undefined
  }
  return rate
}
