import { processEnv } from 'env-loader'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const exportBuildPath = path.resolve(__dirname, '../../.next/export')
if (fs.existsSync(exportBuildPath)) {
  fs.rmdirSync(exportBuildPath, { recursive: true, force: true })
}

processEnv('next build')
