import { SideNavItem } from '@/types/formatted/sideNav'

export interface DeepLinksResult {
  depth: number
  links: SideNavItem | null
}

// Helper function to normalize paths by removing trailing slashes
export function normalizePath(path: string): string {
  return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path
}

// Helper function to check if paths match (ignoring trailing slashes)
export function pathsMatch(path1: string, path2: string): boolean {
  return normalizePath(path1) === normalizePath(path2)
}

// Helper function to check if one path contains another (ignoring trailing slashes)
export function pathContains(fullPath: string, partialPath: string): boolean {
  return normalizePath(fullPath).includes(normalizePath(partialPath))
}

// Helper function to find current path depth and deep links
// Returns the immediate parent of the matched item
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
