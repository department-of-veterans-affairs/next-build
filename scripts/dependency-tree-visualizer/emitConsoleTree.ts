/* eslint-disable no-console */

import chalk from 'chalk'
import { DependencyGraph } from './DependencyGraph'
import { colorizePath } from './colorizePath'

export function emitConsoleTree(graph: DependencyGraph): void {
  const visited = new Set<string>()
  let totalCC = 0
  let totalLoc = 0

  function walk(node: string, depth: number) {
    const info = graph.nodes[node]
    const indent = '  '.repeat(depth)

    if (!info) {
      console.log(indent + chalk.red(`⚠️  Missing: ${node}`))
      return
    }

    if (visited.has(node)) {
      console.log(
        indent + chalk.yellow(`- ${colorizePath(node)} (already included)`)
      )
      return
    }

    visited.add(node)
    totalCC += info.cc
    totalLoc += info.loc
    console.log(
      indent +
        chalk.cyan(`- ${colorizePath(node)} (${info.loc} LoC; ${info.cc} CC)`)
    )

    info.includes.forEach((child) => walk(child.path, depth + 1))
  }

  walk(graph.root, 0)

  console.log('\n')
  console.log(
    chalk.green('Total cyclomatic complexity:'),
    chalk.magenta(totalCC)
  )
  console.log(
    chalk.green('Total lines of code:        '),
    chalk.magenta(totalLoc)
  )
}
