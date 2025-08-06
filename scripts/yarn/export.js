import { processEnv } from 'env-loader'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Debug from 'debug'

const exportLog = Debug('next-build:export')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logsDir = path.resolve(__dirname, '../../logs')

/**
 * Pre-build housekeeping
 */
if (process.env.BUILD_OPTION === 'static') {
  // Clean the export directory to get tugboat working
  const exportBuildPath = path.resolve(__dirname, '../../.next/export')
  if (fs.existsSync(exportBuildPath)) {
    exportLog('Cleaning export directory')
    fs.rmdirSync(exportBuildPath, { recursive: true, force: true })
  }

  // Clean the warning logs
  if (fs.existsSync(logsDir)) {
    exportLog('Cleaning logs directory')
    fs.rmdirSync(logsDir, { recursive: true, force: true })
  }
}

await processEnv('next build', true)

/**
 * Post-build processing
 */
if (process.env.BUILD_OPTION === 'static') {
  // Concatenate all warning-*.md files into a single warnings.md file
  // Get all warning-*.md files
  const files = fs
    .readdirSync(logsDir)
    .filter((file) => file.startsWith('warning-') && file.endsWith('.md'))

  exportLog(`Found ${files.length} warning files to process`)

  const warnings = []

  for (const file of files) {
    const filePath = path.join(logsDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')

    for (const line of lines) {
      if (line.trim() === '') continue
      // Match lines that start with a timestamp
      // Alternatively, we could write JSON as log lines and parse them...if we
      // had more metadata. ¯\_(ツ)_/¯
      const match = line.match(/^\(\d+)\:::(.*)$/)
      if (match) {
        const timestamp = parseInt(match[1], 10)
        const message = match[2].trim()
        warnings.push([timestamp, message])
      }
    }
  }

  // Sort by timestamp
  warnings.sort((a, b) => a[0] - b[0])

  // Create content with just the messages
  const outputContent = warnings.map((w) => w[1]).join('\n')

  // Write to warnings.md
  const outputPath = path.join(logsDir, 'warnings.md')
  exportLog(`Writing ${warnings.length} warnings to ${outputPath}`)
  fs.writeFileSync(outputPath, outputContent)
}
