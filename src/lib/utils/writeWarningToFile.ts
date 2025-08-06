import fs from 'fs'
import path from 'path'
const logsDir = path.resolve(__dirname, '../../../logs')

export const writeWarningToFile = (warning: string) => {
  const timestamp = Math.floor(Date.now() / 1000)
  fs.mkdirSync(path.resolve(logsDir), { recursive: true })
  fs.appendFileSync(
    path.join(logsDir, `warnings-${process.pid}.md`),
    `${timestamp}:::${warning}` + '\n'
  )
}
