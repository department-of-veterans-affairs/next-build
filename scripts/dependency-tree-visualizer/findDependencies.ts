/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import { analyzeLiquidTemplate } from './analyzeLiquid'
import type { DependencyGraph, NodeInfo } from './DependencyGraph'

const INCLUDE_RE = /{%\s*include\s*["']?([^"' ]+)["']?/g

export function buildDependencyGraph(
  entry: string,
  rootDir: string
): DependencyGraph {
  const nodes: Record<string, NodeInfo> = {}
  const visited = new Set<string>()

  function visit(templatePath: string) {
    const absPath = path.resolve(rootDir, templatePath)
    if (visited.has(absPath)) return
    visited.add(absPath)

    let content: string
    try {
      content = fs.readFileSync(absPath, 'utf-8')
    } catch {
      return
    }

    const matches = Array.from(content.matchAll(INCLUDE_RE)).map((m) => m[1])
    const includeMap = new Map<string, number>()

    for (const match of matches) {
      includeMap.set(match, (includeMap.get(match) || 0) + 1)
    }

    const includes = Array.from(includeMap.entries()).map(([path, count]) => ({
      path,
      count,
    }))

    const { lineCount, cyclomaticComplexity } = analyzeLiquidTemplate(content)

    nodes[templatePath] = {
      filepath: templatePath,
      loc: lineCount,
      cc: cyclomaticComplexity,
      includes,
    }

    includes.forEach((i) => visit(i.path))
  }

  visit(entry)

  return { root: entry, nodes }
}
