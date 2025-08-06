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

processEnv('next build', true)
