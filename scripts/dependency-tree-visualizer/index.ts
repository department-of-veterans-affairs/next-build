/* eslint-disable no-console */
/**
 * Usage: bun script/dependency-chain-visualizer/index.ts --dot src/site/facilities/facility_health_service.drupal.liquid ./
 * You can use graphviz to transform the DOT file into a visual representation:
 *   dot -Tsvg graph.dot -o graph.svg
 */
import fs from 'fs'
import chalk from 'chalk'

import { buildDependencyGraph } from './findDependencies'
import { emitConsoleTree } from './emitConsoleTree'
import { generateDotGraph } from './emitDotGraph'

if (require.main === module) {
  const [, , mode, entryFile, rootDir] = process.argv

  if (!entryFile || !rootDir) {
    console.log(
      chalk.magenta(`Usage: ts-node index.ts <mode> <template> <rootDir>`)
    )
    process.exit(1)
  }

  const graph = buildDependencyGraph(entryFile, rootDir)

  if (mode === '--dot') {
    const dot = generateDotGraph(graph)
    fs.writeFileSync('graph.dot', dot)
    console.log(chalk.green('DOT graph written to graph.dot'))
  } else {
    emitConsoleTree(graph)
  }
}
