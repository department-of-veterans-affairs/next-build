/* eslint-disable no-console */
/**
 * Usage: bun script/dependency-chain-visualizer/index.ts --dot src/site/facilities/facility_health_service.drupal.liquid ./
 * You can use graphviz to transform the DOT file into a visual representation:
 *   dot -Tsvg graph.dot -o graph.svg
 */
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { program } from 'commander'

import { buildDependencyGraph } from './findDependencies'
import { emitConsoleTree } from './emitConsoleTree'
import { generateDotGraph } from './emitDotGraph'

if (require.main === module) {
  program
    .option('--dot', 'Emit a .dot file for Graphviz')
    .argument(
      '<path-to-template>',
      'The path to the template to find the dependency tree of'
    )
    .action((pathToTemplate, options) => {
      const entryFile = path.resolve(pathToTemplate)

      // Find the root directory of content build
      const parts = entryFile.split(path.sep)
      const contentBuildPath = parts
        .slice(0, parts.indexOf('content-build') + 1)
        .join(path.sep)

      const graph = buildDependencyGraph(entryFile, contentBuildPath)

      if (options.dot) {
        const dot = generateDotGraph(graph)
        fs.writeFileSync('graph.dot', dot)
        console.log(chalk.green('DOT graph written to graph.dot'))
      } else {
        emitConsoleTree(graph)
      }
    })

  program.parse()
}
