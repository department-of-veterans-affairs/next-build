/* eslint-disable no-console */

import chalk from 'chalk'
import { DependencyGraph } from './DependencyGraph'
import { colorizePath } from './colorizePath'

export function emitConsoleTree(graphs: DependencyGraph[]): void {
  const visited = new Set<string>()
  let totalCC = 0
  let totalLoc = 0

  graphs.forEach((graph) => {
    function walk(nodePath: string, depth: number) {
      const info = graph.nodes[nodePath]
      const indent = '  '.repeat(depth)

      if (!info) {
        console.log(indent + chalk.red(`⚠️  Missing: ${nodePath}`))
        return
      }

      if (visited.has(nodePath)) {
        console.log(
          indent +
            chalk.yellow(`- ${colorizePath(nodePath)} (already included)`)
        )
        return
      }

      visited.add(nodePath)
      totalCC += info.cc
      totalLoc += info.loc
      console.log(
        indent +
          chalk.cyan(
            `- ${colorizePath(nodePath)} (${info.loc} LoC; ${info.cc} CC)`
          )
      )

      info.includes.forEach((child) => walk(child.path, depth + 1))
    }

    walk(graph.root, 0)
  })

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
