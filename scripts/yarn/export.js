import { processEnv } from 'env-loader'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Clean the export directory to get tugboat working
if (process.env.BUILD_OPTION === 'static') {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const exportBuildPath = path.resolve(__dirname, '../../.next/export')
  if (fs.existsSync(exportBuildPath)) {
    fs.rmdirSync(exportBuildPath, { recursive: true, force: true })
  }
}

await processEnv('next build', true)

// Implement this AI!
if (process.env.BUILD_OPTION === 'static') {
  // Read each warning-*.md file in the `logs/` directory
  // Parse each line into a `[timestamp, mesage]` tuple
  //   Each line takes the following format `[unix_timestamp]:::[mesasge]`
  // Sort the tuples by timestamp
  // Write each message to `logs/warnings.md`
}
