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
import { DependencyGraph } from './DependencyGraph'

if (require.main === module) {
  program
    .option('--dot', 'Emit a .dot file for Graphviz')
    .argument(
      '<paths-to-templates...>',
      'One or more paths to the templates to find the dependency tree of'
    )
    .action((pathsToTemplates: string[], options: { dot: boolean }) => {
      const entryFile = path.resolve(pathsToTemplates[0])

      // Find the root directory of content build
      const parts = entryFile.split(path.sep)
      const contentBuildPath = parts
        .slice(0, parts.indexOf('content-build') + 1)
        .join(path.sep)

      const graphs = pathsToTemplates.map((entryFile: string) =>
        buildDependencyGraph(entryFile, contentBuildPath)
      )

      if (options.dot) {
        const dot = generateDotGraph(
          graphs.reduce(
            (allNodes, currentGraph) => ({
              ...allNodes,
              ...currentGraph.nodes,
            }),
            {} as DependencyGraph['nodes']
          )
        )
        fs.writeFileSync('graph.dot', dot)
        console.log(chalk.green('DOT graph written to graph.dot'))
      } else {
        emitConsoleTree(graphs)
      }
    })

  program.parse()
}
