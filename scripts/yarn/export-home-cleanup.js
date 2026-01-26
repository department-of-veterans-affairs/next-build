/**
 * Post-build cleanup: Delete index.html if homepage feature flag is off
 * This prevents the 404 HTML file from being served, allowing fallback to content-build
 */

import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getAllVars } from 'env-loader'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// const envVars = await getAllVars()
// const isHomepageFeatureEnabled =
//   envVars.FEATURE_NEXT_BUILD_CONTENT_ALL === 'true' ||
//   envVars.FEATURE_NEXT_BUILD_CONTENT_HOMEPAGE === 'true'

// eslint-disable-next-line no-console
console.log(process.env)

const isHomepageFeatureEnabled =
  process.env.FEATURE_NEXT_BUILD_CONTENT_ALL === 'true' ||
  process.env.FEATURE_NEXT_BUILD_CONTENT_HOMEPAGE === 'true'

if (!isHomepageFeatureEnabled) {
  const exportBuildPath = path.resolve(__dirname, '../../out')
  const indexHtmlPath = path.resolve(exportBuildPath, 'index.html')
  const indexTxtPath = path.resolve(exportBuildPath, 'index.txt')

  if (fs.existsSync(indexHtmlPath)) {
    // eslint-disable-next-line no-console
    console.log(
      chalk.yellow(
        'Homepage feature flag is disabled. Deleting index.html and index.txt to prevent serving 404 content.'
      )
    )
    fs.unlinkSync(indexHtmlPath)
  }
  if (fs.existsSync(indexTxtPath)) {
    fs.unlinkSync(indexTxtPath)
  }
}
