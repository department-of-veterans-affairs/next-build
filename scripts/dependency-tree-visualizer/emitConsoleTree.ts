/* eslint-disable no-console */

import chalk from 'chalk'
import { DependencyGraph } from './DependencyGraph'
import { colorizePath } from './colorizePath'

export function emitConsoleTree(
  graphs: DependencyGraph[],
  summary: boolean
): void {
  const visited = new Set<string>()
  let totalCC = 0
  let totalLoc = 0
  let maxDepth = 0

  const log = summary ? (...args: unknown[]) => {} : console.log.bind(console)

  graphs.forEach((graph) => {
    function walk(nodePath: string, depth: number) {
      if (depth > maxDepth) maxDepth = depth
      const info = graph.nodes[nodePath]
      const indent = '  '.repeat(depth)

      if (!info) {
        log(indent + chalk.red(`- ⚠️  Missing: ${nodePath}`))
        return
      }

      if (visited.has(nodePath)) {
        log(
          indent +
            chalk.yellow(`- ${colorizePath(nodePath)} (already included)`)
        )
        return
      }

      visited.add(nodePath)
      totalCC += info.cc
      totalLoc += info.loc
      log(
        indent +
          chalk.cyan(
            `- ${colorizePath(nodePath)} (${info.loc} LoC; ${info.cc} CC)`
          )
      )

      info.includes.forEach((child) => walk(child.path, depth + 1))
    }

    walk(graph.root, 0)
  })

  log('\n')
  console.log(
    chalk.green('Total cyclomatic complexity:'),
    chalk.magenta(totalCC)
  )
  console.log(
    chalk.green('Total lines of code:        '),
    chalk.magenta(totalLoc)
  )
  console.log(
    chalk.green('Maximum depth of tree:      '),
    chalk.magenta(maxDepth + 1) // 0-indexed depth
  )
  console.log(
    chalk.green('Total number of files:      '),
    chalk.magenta(visited.size)
  )
}
