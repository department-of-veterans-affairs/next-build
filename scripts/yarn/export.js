import { processEnv } from 'env-loader'
import fs from 'fs'
import path from 'path'

const exportBuildPath = path.resolve(__dirname, '../../.next/export')
if (fs.existsSync(exportBuildPath)) {
  fs.rmdirSync(exportBuildPath, { recursive: true, force: true })
}

processEnv('next build')
