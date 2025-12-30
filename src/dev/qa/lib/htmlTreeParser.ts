/**
 * HTML Tree Parser
 *
 * Parses HTML DOM elements into a hierarchical tree structure for comparison.
 * Returns rich data structures with lookup tables for efficient access.
 */

// =============================================================================
// Type Definitions (Discriminated Unions)
// =============================================================================

interface BaseNode {
  /** Unique key for matching between trees (tag + id + classes + important attrs) */
  matchKey: string
  /** Reference to parent node's matchKey for ancestry checks */
  parentMatchKey?: string
  /** Depth in the tree (0 = root) */
  depth: number
}

export interface ElementNode extends BaseNode {
  type: 'element'
  tagName: string
  attributes: Record<string, string>
  children: HtmlTreeNode[]
  id?: string
}

export interface TextNode extends BaseNode {
  type: 'text'
  textContent: string
}

export type HtmlTreeNode = ElementNode | TextNode

// =============================================================================
// Flat Node (for matching algorithm)
// =============================================================================

export interface FlatNode {
  node: HtmlTreeNode
  /** Path from root as array of child indices, e.g., [0, 2, 1] */
  path: number[]
  /** Sequential index in flattened array */
  index: number
}

// =============================================================================
// Parser Options & Return Type
// =============================================================================

export interface ParseHtmlOptions {
  /** Trim and skip whitespace-only text nodes */
  collapseWhitespace?: boolean
  /** Include data-testid in attributes (default: true) */
  includeDataTestId?: boolean
}

export interface ParsedHtmlTree {
  /** Root node of the tree */
  root: HtmlTreeNode
  /** Pre-flattened nodes for matching algorithm */
  flatNodes: FlatNode[]
  /** O(1) lookup by matchKey */
  nodesByMatchKey: Map<string, HtmlTreeNode>
}

// =============================================================================
// Path Utilities
// =============================================================================

/**
 * Converts a path array to a string key for lookups
 */
export function pathToString(path: number[]): string {
  return path.join('/')
}

/**
 * Checks if two paths are equal
 */
export function pathsEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

/**
 * Checks if `ancestor` path is an ancestor of `descendant` path
 */
export function isAncestorPath(
  ancestor: number[],
  descendant: number[]
): boolean {
  return (
    ancestor.length < descendant.length &&
    ancestor.every((v, i) => v === descendant[i])
  )
}

// =============================================================================
// Match Key Generation
// =============================================================================

/**
 * Generates a match key for intelligent element matching.
 * Uses ID, classes, and important attributes as identity signals.
 * Does NOT include path information - that's tracked separately.
 */
function generateMatchKey(
  tagName: string,
  attributes: Record<string, string>,
  id?: string
): string {
  const parts: string[] = []

  // Tag name is always included
  parts.push(tagName)

  // ID is the strongest match signal
  if (id) {
    parts.push(`#${id}`)
  }

  // Classes are good match signals (normalized to ignore order)
  const classes = attributes.class
  if (classes) {
    const sortedClasses = classes.split(/\s+/).filter(Boolean).sort().join('.')
    parts.push(`.${sortedClasses}`)
  }

  // Other important attributes
  const importantAttrs = ['name', 'data-template', 'data-testid', 'role']
  for (const attrName of importantAttrs) {
    const attrValue = attributes[attrName]
    if (attrValue) {
      parts.push(`[${attrName}="${attrValue}"]`)
    }
  }

  return parts.join('')
}

/**
 * Generates a unique match key by combining element identity with path
 */
function generateUniqueMatchKey(baseMatchKey: string, path: number[]): string {
  if (path.length === 0) {
    return baseMatchKey
  }
  return `${pathToString(path)}:${baseMatchKey}`
}

// =============================================================================
// Main Parser
// =============================================================================

/**
 * Parses an HTML Element into a hierarchical tree structure with lookup tables.
 *
 * @param element - The DOM element to parse
 * @param options - Parser options
 * @returns ParsedHtmlTree with root, flatNodes, and lookup maps
 */
export function parseHtmlToTree(
  element: Element,
  options: ParseHtmlOptions = {}
): ParsedHtmlTree {
  const { collapseWhitespace = false, includeDataTestId = true } = options

  const flatNodes: FlatNode[] = []
  const nodesByMatchKey = new Map<string, HtmlTreeNode>()
  let flatIndex = 0

  /**
   * Recursively traverses the DOM and builds the tree
   */
  function traverse(
    el: Element,
    depth: number,
    path: number[],
    parentMatchKey?: string
  ): ElementNode {
    // Collect attributes
    const attributes: Record<string, string> = {}
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i]
      // Skip data-testid if option is disabled
      if (!includeDataTestId && attr.name === 'data-testid') {
        continue
      }
      attributes[attr.name] = attr.value
    }

    const tagName = el.tagName.toLowerCase()
    const id = el.id || undefined
    const baseMatchKey = generateMatchKey(tagName, attributes, id)
    const matchKey = generateUniqueMatchKey(baseMatchKey, path)

    // Create the element node
    const node: ElementNode = {
      type: 'element',
      tagName,
      attributes,
      children: [],
      depth,
      matchKey,
      parentMatchKey,
      ...(id && { id }),
    }

    // Add to lookup map
    nodesByMatchKey.set(matchKey, node)

    // Add to flat list
    flatNodes.push({
      node,
      path: [...path],
      index: flatIndex++,
    })

    // Process children
    let childIndex = 0

    for (let i = 0; i < el.childNodes.length; i++) {
      const child = el.childNodes[i]

      if (child.nodeType === 1) {
        // Element node
        const childElement = child as Element
        const childPath = [...path, childIndex]
        const childNode = traverse(childElement, depth + 1, childPath, matchKey)
        node.children.push(childNode)
        childIndex++
      } else if (child.nodeType === 3) {
        // Text node
        let textContent = child.textContent?.replace(/\s+/g, ' ') ?? ''

        if (collapseWhitespace) {
          textContent = textContent.trim()
          if (textContent === '') {
            continue
          }
        }

        const childPath = [...path, childIndex]
        const textMatchKey = generateUniqueMatchKey('text', childPath)

        const textNode: TextNode = {
          type: 'text',
          textContent,
          depth: depth + 1,
          matchKey: textMatchKey,
          parentMatchKey: matchKey,
        }

        node.children.push(textNode)
        nodesByMatchKey.set(textMatchKey, textNode)

        flatNodes.push({
          node: textNode,
          path: childPath,
          index: flatIndex++,
        })

        childIndex++
      }
      // Note: Comment nodes (nodeType === 8) and other node types are intentionally
      // ignored as they are not useful for QA comparison purposes
    }

    return node
  }

  const root = traverse(element, 0, [], undefined)

  return {
    root,
    flatNodes,
    nodesByMatchKey,
  }
}
