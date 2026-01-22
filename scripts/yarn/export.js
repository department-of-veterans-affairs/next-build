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

const exitCode = await processEnv('next build --turbopack', true)

/**
 * Post-build cleanup: Delete index.html if homepage feature flag is off
 * This prevents the 404 HTML file from being served, allowing fallback to content-build
 */
if (process.env.BUILD_OPTION === 'static') {
  const isHomepageFeatureEnabled =
    process.env.FEATURE_NEXT_BUILD_CONTENT_ALL === 'true' ||
    process.env.FEATURE_NEXT_BUILD_CONTENT_HOMEPAGE === 'true'

  if (!isHomepageFeatureEnabled) {
    const exportBuildPath = path.resolve(__dirname, '../../out')
    const indexHtmlPath = path.resolve(exportBuildPath, 'index.html')

    if (fs.existsSync(indexHtmlPath)) {
      exportLog(
        'Homepage feature flag is disabled. Deleting index.html to prevent serving 404 content.'
      )
      fs.unlinkSync(indexHtmlPath)
    }
  }
}

// Exit with the same code as the build process if it failed
// This ensures the script fails if the build failed
if (exitCode !== 0) {
  process.exit(exitCode)
}
