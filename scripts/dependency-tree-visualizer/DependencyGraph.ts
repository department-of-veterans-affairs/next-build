export interface NodeInfo {
  filepath: string
  loc: number
  cc: number
  includes: Array<{ path: string; count: number }>
}

export interface DependencyGraph {
  root: string
  nodes: Record<string, NodeInfo>
}
