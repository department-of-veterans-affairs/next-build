import { SideNavItem } from '@/types/formatted/sideNav'

/**
 * Result returned by findCurrentPathDepth function
 */
export interface DeepLinksResult {
  /** The depth level where the match was found (0 if no match) */
  depth: number
  /** The immediate parent item containing the matched page, or null */
  links: SideNavItem | null
}

/**
 * Normalizes a path by removing trailing slashes (except for the root path).
 *
 * @param path - The path to normalize (e.g., "/test/path/")
 * @returns The normalized path without trailing slash (e.g., "/test/path")
 *
 * @example
 * normalizePath("/test/path/")  // Returns: "/test/path"
 * normalizePath("/test/path")   // Returns: "/test/path"
 * normalizePath("/")            // Returns: "/"
 */
export function normalizePath(path: string): string {
  return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path
}

/**
 * Checks if two paths are equal, ignoring trailing slashes.
 *
 * @param path1 - First path to compare
 * @param path2 - Second path to compare
 * @returns true if the paths match after normalization
 *
 * @example
 * pathsMatch("/test/path/", "/test/path")  // Returns: true
 * pathsMatch("/test/path", "/other/path")  // Returns: false
 */
export function pathsMatch(path1: string, path2: string): boolean {
  return normalizePath(path1) === normalizePath(path2)
}

/**
 * Checks if one path contains another as a substring, ignoring trailing slashes.
 *
 * @param fullPath - The path to search within
 * @param partialPath - The substring to search for
 * @returns true if fullPath contains partialPath after normalization (returns false for empty partialPath)
 *
 * @example
 * pathContains("/test/path/deep", "/test/path")  // Returns: true
 * pathContains("/test/path", "/other")           // Returns: false
 * pathContains("/test/path", "")                 // Returns: false
 */
export function pathContains(
  fullPath: string | null | undefined,
  partialPath: string | null | undefined
): boolean {
  const normalizedFull = normalizePath(fullPath)
  const normalizedPartial = normalizePath(partialPath)

  // Don't consider empty strings as "contained"
  if (!normalizedPartial) return false

  return normalizedFull.includes(normalizedPartial)
}

/**
 * Finds the depth and immediate parent of a given path in a navigation hierarchy.
 *
 * This function performs a depth-first search through the navigation tree to locate
 * the current page and return information about its position in the hierarchy.
 *
 * Key behaviors:
 * - Returns the immediate **parent** of the matched item (not the matched item itself)
 * - Traverses nodes with empty `url.path` values (structural/grouping nodes)
 * - Handles trailing slashes in both the current path and menu item paths
 * - Returns early once a match is found (optimized traversal)
 *
 * @param links - Array of navigation items to search through
 * @param currentPath - The current page path to locate (e.g., "/life-insurance/options-eligibility/sgli")
 * @param depth - Current depth level in the hierarchy (1-indexed, default: 1)
 *
 * @returns Object containing:
 *   - `depth`: The depth level where the match was found (0 if no match)
 *   - `links`: The immediate parent item containing the matched page, or null if:
 *       - No match was found (depth will be 0)
 *       - Match was at the top level with no parent (depth will be > 0)
 *
 * @example
 * // Given a menu structure:
 * // - Get benefits (empty path)
 * //   - Options and eligibility (/life-insurance/options-eligibility)
 * //     - SGLI (/life-insurance/options-eligibility/sgli)  <-- current page
 *
 * const result = findCurrentPathDepth(menu, '/life-insurance/options-eligibility/sgli/')
 * // Returns: { depth: 3, links: <Options and eligibility item> }
 * // The parent "Options and eligibility" is returned (not "Get benefits")
 */
export function findCurrentPathDepth(
  links: SideNavItem[],
  currentPath: string,
  depth = 1
): DeepLinksResult {
  for (const link of links) {
    // Check if this is the exact match
    if (pathsMatch(link.url.path, currentPath)) {
      // Return null links to signal we found the match itself
      return { depth, links: null }
    }

    // Recursively search children
    if (link.links && link.links.length > 0) {
      const result = findCurrentPathDepth(link.links, currentPath, depth + 1)

      // If we found something in children
      if (result.depth > 0) {
        // If result.links is null, it means we found the exact match in immediate children
        // So we should return ourselves as the parent
        if (result.links === null) {
          return { depth: result.depth, links: link }
        }
        // If result.links is not null, it means we found the parent deeper in the tree
        // Pass it through without wrapping
        return result
      }
    }
  }

  // No match found
  return { depth: 0, links: null }
}
