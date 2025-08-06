import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logsDir = path.resolve(__dirname, '../../../logs')

export const writeWarningToFile = (warning: string) => {
  const timestamp = Math.floor(Date.now() / 1000)
  fs.appendFileSync(
    path.join(logsDir, `warnings-${process.pid}.md`),
    `${timestamp}:::${warning}` + '\n'
  )
}
