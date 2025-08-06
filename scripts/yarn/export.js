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

if (process.env.BUILD_OPTION === 'static') {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const logsDir = path.resolve(__dirname, '../../logs')
  
  // Get all warning-*.md files
  const files = fs.readdirSync(logsDir).filter(file => file.startsWith('warning-') && file.endsWith('.md'))
  
  const warnings = []
  
  for (const file of files) {
    const filePath = path.join(logsDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    for (const line of lines) {
      if (line.trim() === '') continue
      const match = line.match(/^\[(\d+)\]:::(.*)$/)
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
  const outputContent = warnings.map(w => w[1]).join('\n')
  
  // Write to warnings.md
  const outputPath = path.join(logsDir, 'warnings.md')
  fs.writeFileSync(outputPath, outputContent)
}
