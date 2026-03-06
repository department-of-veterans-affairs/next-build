import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import {
  PAGE_RESOURCE_TYPES,
  PageResourceType,
} from '@/lib/constants/resourceTypes'

const CSV_PATH = path.join(
  process.cwd(),
  '.performance-data',
  'performance-scores.csv'
)

const CSV_HEADERS = [
  'Content type',
  'URL',
  'Avg mobile score',
  'Avg desktop score',
  'Version number',
  'Test date',
] as const

export interface PerformanceScoreRow {
  'Content type': string
  URL: string
  'Avg mobile score': string
  'Avg desktop score': string
  'Version number': string
  'Test date': string
}

function parseCSV(content: string): PerformanceScoreRow[] {
  const lines = content.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  const rows: PerformanceScoreRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length >= CSV_HEADERS.length) {
      rows.push({
        'Content type': values[0] ?? '',
        URL: values[1] ?? '',
        'Avg mobile score': values[2] ?? '',
        'Avg desktop score': values[3] ?? '',
        'Version number': values[4] ?? '',
        'Test date': values[5] ?? '',
      })
    }
  }
  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if ((char === ',' && !inQuotes) || char === '\n') {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function stringifyCSV(rows: PerformanceScoreRow[]): string {
  const headerLine = CSV_HEADERS.map(escapeCSVValue).join(',')
  const dataLines = rows.map((row) =>
    CSV_HEADERS.map((h) => escapeCSVValue(row[h] ?? '')).join(',')
  )
  return [headerLine, ...dataLines].join('\n')
}

function readCSV(): PerformanceScoreRow[] {
  if (!fs.existsSync(CSV_PATH)) {
    return []
  }
  const content = fs.readFileSync(CSV_PATH, 'utf-8')
  return parseCSV(content)
}

function writeCSV(rows: PerformanceScoreRow[]): void {
  const dir = path.dirname(CSV_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(CSV_PATH, stringifyCSV(rows), 'utf-8')
}

function isValidContentType(input: string): boolean {
  // Empty string is valid (e.g. Home page has no node type)
  if (input === '') return true
  return PAGE_RESOURCE_TYPES.includes(input as PageResourceType)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const rows = readCSV()
      return res.status(200).json(rows)
    } catch (error) {
      console.error('API Error:', error)
      return res.status(500).json({
        error: error?.message || 'Failed to read performance scores',
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { action, row, rowIndex } = req.body

      if (action === 'update' && typeof rowIndex === 'number') {
        const rows = readCSV()
        if (rowIndex < 0 || rowIndex >= rows.length) {
          return res.status(400).json({ error: 'Invalid row index' })
        }
        const updatedRow = row as Partial<PerformanceScoreRow>
        if (
          updatedRow['Content type'] &&
          !isValidContentType(updatedRow['Content type'])
        ) {
          return res.status(400).json({
            error: `Invalid content type. Must be one of: ${PAGE_RESOURCE_TYPES.join(', ')}`,
          })
        }
        rows[rowIndex] = { ...rows[rowIndex], ...updatedRow }
        writeCSV(rows)
        return res.status(200).json(rows[rowIndex])
      }

      if (action === 'add' && row) {
        const newRow = row as PerformanceScoreRow
        if (
          newRow['Content type'] &&
          !isValidContentType(newRow['Content type'])
        ) {
          return res.status(400).json({
            error: `Invalid content type. Must be one of: ${PAGE_RESOURCE_TYPES.join(', ')}`,
          })
        }
        const rows = readCSV()
        const fullRow: PerformanceScoreRow = {
          'Content type': newRow['Content type'] ?? '',
          URL: newRow.URL ?? '',
          'Avg mobile score': newRow['Avg mobile score'] ?? '',
          'Avg desktop score': newRow['Avg desktop score'] ?? '',
          'Version number': newRow['Version number'] ?? '',
          'Test date': newRow['Test date'] ?? '',
        }
        rows.push(fullRow)
        writeCSV(rows)
        return res.status(200).json(fullRow)
      }

      if (action === 'delete' && typeof rowIndex === 'number') {
        const rows = readCSV()
        if (rowIndex < 0 || rowIndex >= rows.length) {
          return res.status(400).json({ error: 'Invalid row index' })
        }
        rows.splice(rowIndex, 1)
        writeCSV(rows)
        return res.status(200).json({ success: true })
      }

      return res.status(400).json({ error: 'Invalid action or parameters' })
    } catch (error) {
      console.error('API Error:', error)
      return res.status(500).json({
        error: error?.message || 'Failed to update performance scores',
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
