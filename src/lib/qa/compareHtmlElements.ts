export interface ComparisonResult {
  success: boolean
  message: string
  culprits?: [string, string] // [culpritA, culpritB] when success is false
  testName?: string // Name of the test that failed
}

export type ComparisonTestFn = (
  e1: Element,
  e2: Element
) => [string, string] | true

export type ComparisonTest = {
  name: string
  description: string
  test: ComparisonTestFn
}

/**
 * Extracts the outer HTML from an element without child HTML.
 * Clones the element, clears its content, then returns the outerHTML.
 * For example: <div class="foo"><span>stuff</span></div> returns <div class="foo"></div>
 */
function getOpeningTag(element: Element): string {
  return (element?.cloneNode(false) as Element)?.outerHTML ?? null
}

export const elemIdMatch: ComparisonTest = {
  name: 'All element ID check',
  description: 'Checks all child element IDs for match',
  test: (elem1: Element, elem2: Element) => {
    const children1 = [...elem1.querySelectorAll('*')]
    const children2 = [...elem2.querySelectorAll('*')]

    const checkLen = Math.max(children1.length, children2.length)

    for (let i = 0; i < checkLen; i++) {
      const child1 = children1[i]
      const child2 = children2[i]

      if (child1?.id !== child2?.id) {
        return [getOpeningTag(child1), getOpeningTag(child2)]
      }
    }

    return true
  },
}

const defaultComparisonTests: ComparisonTest[] = [elemIdMatch]

/**
 * Compares two DOM elements and returns a comparison result.
 *
 * @param elem1 - DOM Element from the first environment
 * @param elem2 - DOM Element from the second environment
 * @returns ComparisonResult object with success status and message
 *
 * Example usage:
 * ```typescript
 * const buttons1 = element1.querySelectorAll('button');
 * const buttons2 = element2.querySelectorAll('button');
 * if (buttons1.length !== buttons2.length) {
 *   return { success: false, message: 'Different number of buttons' };
 * }
 * ```
 */
export function compareHtmlElements(
  elem1: Element,
  elem2: Element,
  tests: ComparisonTest[] = defaultComparisonTests
): ComparisonResult {
  const failure = tests
    .map((test) => ({ ...test, result: test.test(elem1, elem2) }))
    .find((test) => test.result !== true)

  if (failure) {
    return {
      success: false,
      message: `${failure.name} failed: ${failure.description}`,
      culprits: failure.result as [string, string],
      testName: failure.name,
    }
  }

  return {
    success: true,
    message: 'All comparison tests passed',
  }
}
