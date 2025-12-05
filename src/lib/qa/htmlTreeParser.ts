export interface HtmlTreeNode {
  type: 'element' | 'text'
  tagName?: string
  attributes?: Record<string, string>
  textContent?: string
  children?: HtmlTreeNode[]
  // Used for matching and rendering
  id?: string
  matchKey?: string // Unique key for element matching
  depth: number
}

/**
 * Parses an HTML Element into a hierarchical tree structure
 */
export function parseHtmlToTree(
  element: Element,
  depth: number = 0,
  pathPrefix: string = ''
): HtmlTreeNode {
  const node: HtmlTreeNode = {
    type: 'element',
    tagName: element.tagName.toLowerCase(),
    attributes: {},
    children: [],
    depth,
  }

  // Collect attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    node.attributes![attr.name] = attr.value
  }

  // Store ID for matching
  if (element.id) {
    node.id = element.id
  }

  // Generate match key for intelligent matching with path to ensure uniqueness
  const baseMatchKey = generateMatchKey(node)
  node.matchKey = pathPrefix ? `${pathPrefix}/${baseMatchKey}` : baseMatchKey

  // Process children
  // Track tree child index separately from DOM childNodes index to ensure path consistency
  let treeChildIndex = 0

  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i]

    if (child.nodeType === 1) {
      // Element node
      const childElement = child as Element
      node.children!.push(
        parseHtmlToTree(
          childElement,
          depth + 1,
          `${node.matchKey}[${treeChildIndex}]`
        )
      )
      treeChildIndex++
    } else if (child.nodeType === 3) {
      // Text node - preserve ALL text nodes, including whitespace-only
      // This ensures 1:1 representation of the original HTML
      const textMatchKey = `${node.matchKey}[${treeChildIndex}]text`
      node.children!.push({
        type: 'text',
        textContent: child.textContent || '',
        depth: depth + 1,
        matchKey: textMatchKey,
      })
      treeChildIndex++
    }
    // Note: Comment nodes (nodeType === 8) and other node types are intentionally
    // ignored as they are not useful for QA comparison purposes
  }

  return node
}

/**
 * Generates a match key for intelligent element matching.
 * Uses ID, classes, and other attributes as clues.
 */
function generateMatchKey(node: HtmlTreeNode): string {
  const parts: string[] = []

  // Tag name is always included
  parts.push(node.tagName || 'text')

  // ID is the strongest match signal
  if (node.id) {
    parts.push(`#${node.id}`)
  }

  // Classes are good match signals (normalized to ignore order)
  const classes = node.attributes?.class
  if (classes) {
    const sortedClasses = classes.split(/\s+/).filter(Boolean).sort().join('.')
    parts.push(`.${sortedClasses}`)
  }

  // Other important attributes
  const importantAttrs = ['name', 'data-template', 'data-testid', 'role']
  for (const attrName of importantAttrs) {
    const attrValue = node.attributes?.[attrName]
    if (attrValue) {
      parts.push(`[${attrName}="${attrValue}"]`)
    }
  }

  return parts.join('')
}

/**
 * Flattens a tree into an array of nodes with their paths
 */
export interface FlatNode {
  node: HtmlTreeNode
  path: number[] // Path from root, e.g., [0, 2, 1] means root->child[0]->child[2]->child[1]
  index: number // Sequential index in flattened array
}

export function flattenTree(
  tree: HtmlTreeNode,
  path: number[] = []
): FlatNode[] {
  const result: FlatNode[] = []
  let index = 0

  function traverse(node: HtmlTreeNode, currentPath: number[]) {
    result.push({
      node,
      path: currentPath,
      index: index++,
    })

    if (node.children) {
      node.children.forEach((child, i) => {
        traverse(child, [...currentPath, i])
      })
    }
  }

  traverse(tree, path)
  return result
}
