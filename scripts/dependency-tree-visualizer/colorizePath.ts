import path from 'path'
import chalk from 'chalk'

/**
 * Colorizes a file path for better readability.
 * - Directory path: dim gray
 * - Base filename: bold cyan
 * - Extension: dim
 */
export function colorizePath(filepath: string): string {
  const dirname = path.dirname(filepath)
  const basename = path.basename(filepath)
  const ext = path.extname(basename)
  const nameWithoutExt = basename.slice(0, basename.length - ext.length)

  const coloredPath = [
    chalk.dim(dirname + path.sep),
    chalk.bold.cyan(nameWithoutExt),
    chalk.dim(ext),
  ]

  return coloredPath.join('')
}
