import fs from 'fs'
import path from 'path'

// Use process.cwd() instead of __dirname for better compatibility
const logsDir = path.resolve(process.cwd(), 'logs')

export const writeWarningToFile = (warning: string) => {
  const timestamp = Math.floor(Date.now() / 1000)

  // Check if directory exists before trying to create it
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }

  fs.appendFileSync(
    path.join(logsDir, `warnings-${process.pid}.md`),
    `${timestamp}:::${warning}` + '\n'
  )
}
