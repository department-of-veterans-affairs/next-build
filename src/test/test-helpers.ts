import { axe } from '@/test-utils'

type AxeResults = Awaited<ReturnType<typeof axe>>

/**
 * Separates axe-core accessibility violations into two groups:
 *   1. Violations whose `id` matches one or more of the given `ids`
 *   2. All remaining violations
 *
 * This allows tests to “carve out” known or expected violations
 * (for example, `empty-heading` violations that occur because a
 * `<va-link>` web component has not yet hydrated) while still asserting
 * that the rest of the page contains **no unexpected issues**.
 *
 * @param results
 *   The full Axe results object returned by `axe(container)`.
 *
 * @param ids
 *   One or more rule IDs to extract from the results. These IDs must
 *   match the `id` field of an axe-core violation.
 *
 * @returns
 *   A tuple:
 *     - `[0]`: an array of violations whose `id` matches one of the provided `ids`
 *     - `[1]`: a copy of the original Axe results with those violations removed
 *
 * @example
 *   const axeResults = await axe(container)
 *   const [emptyHeadingViolations, filteredResults] = filterViolations(
 *     axeResults,
 *     'empty-heading'
 *   )
 *
 *   expect(filteredResults).toHaveNoViolations()
 *   expect(emptyHeadingViolations).toHaveLength(1)
 */
export const filterViolations = (
  results: AxeResults,
  ...ids: string[]
): [AxeResults['violations'], AxeResults] => {
  const filteredViolations = results.violations.filter(
    (violation) => !ids.includes(violation.id)
  )
  const pickedViolations = results.violations.filter((violation) =>
    ids.includes(violation.id)
  )
  return [pickedViolations, { ...results, violations: filteredViolations }]
}
