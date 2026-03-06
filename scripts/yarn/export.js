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

const buildStartMs = Date.now()
exportLog('Starting static page generation...')

// processEnv spawns `next build` and calls process.exit() on completion,
// so code after await never runs. Use process.on('exit') to log timing.
process.on('exit', () => {
  const buildDurationMs = Date.now() - buildStartMs
  const buildDurationMin = (buildDurationMs / 60_000).toFixed(1)
  // Use console.log directly — Debug may not flush async stderr during exit
  console.log(
    `\n  next-build:export Static page generation completed in ${buildDurationMs}ms (${buildDurationMin} min)\n`
  )
})

await processEnv('next build --turbopack', true)
