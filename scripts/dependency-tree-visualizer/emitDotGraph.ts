import { DependencyGraph, NodeInfo } from './DependencyGraph'
import path from 'path'

function getColorByValue(value: number, thresholds: [number, number]): string {
  if (value <= thresholds[0]) return 'green'
  if (value <= thresholds[1]) return 'orange'
  return 'red'
}

export function htmlLabel(node: NodeInfo): string {
  const dirname = path.dirname(node.filepath) + '/'
  const basename = path.basename(node.filepath)
  const ext = path.extname(basename)
  const nameWithoutExt = basename.slice(0, basename.length - ext.length)

  const locColor = getColorByValue(node.loc, [50, 200])
  const ccColor = getColorByValue(node.cc, [5, 10])

  return `<
    <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0">
      <TR>
        <TD>
          <FONT COLOR="gray">${dirname}</FONT>
          <FONT COLOR="blue">${nameWithoutExt}</FONT>
          <FONT COLOR="gray">${ext}</FONT>
        </TD>
      </TR>
      <TR>
        <TD>
          <FONT COLOR="${locColor}" POINT-SIZE="10">${node.loc} LoC</FONT>
          <FONT COLOR="${ccColor}" POINT-SIZE="10">${node.cc} CC</FONT>
        </TD>
      </TR>
    </TABLE>
  >`
}

export function generateDotGraph(nodes: DependencyGraph['nodes']): string {
  const lines: string[] = ['digraph G {']
  lines.push('  node [shape=box, style=filled, fontname="Helvetica"];')
  lines.push('  edge [fontname="Helvetica"];')

  // Optional layout hint: left-to-right
  // lines.push('  rankdir=LR;');

  // Emit node labels with LoC and Cyclomatic Complexity
  for (const node of Object.values(nodes)) {
    lines.push(
      `  "${node.filepath}" [label=${htmlLabel(
        node
      )}, shape=box, style=filled, fillcolor=white];`
    )
  }

  // Emit edges with optional count annotations
  const seenEdges = new Set<string>()

  for (const node of Object.values(nodes)) {
    for (const { path: include, count } of node.includes) {
      const edgeKey = `"${node.filepath}" -> "${include}"`

      // Avoid duplicate edge lines
      if (seenEdges.has(edgeKey)) continue
      seenEdges.add(edgeKey)

      const label = count > 1 ? ` [label="${count}×"]` : ''

      if (nodes[include]) {
        // Known node: regular edge
        lines.push(`  ${edgeKey}${label};`)
      } else {
        // Missing node: dashed red edge
        lines.push(`  ${edgeKey} [style=dashed, color=red, label="${count}×"];`)
        lines.push(
          `  "${include}" [label="${include}\\n(MISSING)", style=dashed, color=red];`
        )
      }
    }
  }

  lines.push('}')
  return lines.join('\n')
}
