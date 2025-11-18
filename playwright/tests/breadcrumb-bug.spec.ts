import { test } from '../utils/next-test'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { RESOURCE_TYPES } from '../../src/lib/constants/resourceTypes'

// Configuration constants
const RESOURCE_TYPE_TO_TEST = RESOURCE_TYPES.PRESS_RELEASE // Change this to test different resource types
const START_INDEX = 0 // Starting index in the paths array
const COUNT: number = 50 // Number of paths to test (set to -1 to test all remaining paths)
const IGNORE_CAPITALIZATION = true // If true, "Hello" and "hello" are considered a match

// Load cached paths from CSV file
const PATHS_DIR = join(process.cwd(), 'playwright', 'test-paths')
const PATHS_FILE = join(PATHS_DIR, `${RESOURCE_TYPE_TO_TEST}.csv`)
const RESULTS_DIR = join(process.cwd(), 'playwright', 'test-results-breadcrumb')
const RESULTS_FILE = join(RESULTS_DIR, `${RESOURCE_TYPE_TO_TEST}.csv`)

let paths: string[]

try {
  const fileContent = readFileSync(PATHS_FILE, 'utf-8')
  paths = fileContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
} catch (error) {
  console.error(`Error loading ${PATHS_FILE}:`, error)
  console.error('Please run: yarn playwright:collect-paths')
  throw error
}

if (paths.length === 0) {
  console.warn(`No paths found for resource type: ${RESOURCE_TYPE_TO_TEST}`)
}

// Determine which paths to test
const endIndex =
  COUNT === -1 ? paths.length : Math.min(START_INDEX + COUNT, paths.length)
const pathsToTest = paths.slice(START_INDEX, endIndex)

console.log(`\nTesting breadcrumb bug:`)
console.log(`  Resource Type: ${RESOURCE_TYPE_TO_TEST}`)
console.log(
  `  Paths range: ${START_INDEX} to ${endIndex - 1} (${pathsToTest.length} paths)`
)
console.log(`  Ignore capitalization: ${IGNORE_CAPITALIZATION}`)
console.log(`  Base URL: http://localhost:3999`)
console.log(`  Results file: ${RESULTS_FILE}\n`)

// Ensure results directory exists
if (!existsSync(RESULTS_DIR)) {
  mkdirSync(RESULTS_DIR, { recursive: true })
}

// Helper function to escape CSV values
function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// Helper function to append CSV row
function appendCsvRow(filePath: string, row: string[]) {
  const csvRow = row.map(escapeCsvValue).join(',') + '\n'
  if (existsSync(filePath)) {
    // Append to existing file
    const existingContent = readFileSync(filePath, 'utf-8')
    writeFileSync(filePath, existingContent + csvRow, 'utf-8')
  } else {
    // Create new file with header
    const header = 'path,breadcrumbTitle,pageTitle\n'
    writeFileSync(filePath, header + csvRow, 'utf-8')
  }
}

test.describe('Breadcrumb Bug Detection', () => {
  // Disable parallel execution to avoid file write race conditions
  test.describe.configure({ mode: 'serial' })

  for (const path of pathsToTest) {
    test(`Check breadcrumb match for ${path}`, async ({ page }) => {
      const url = `http://localhost:3999${path}`

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

        // Check if va-breadcrumbs element exists
        const breadcrumbElement = await page.locator('va-breadcrumbs').first()
        const breadcrumbExists = (await breadcrumbElement.count()) > 0

        if (!breadcrumbExists) {
          console.log(`  ⚠ No va-breadcrumbs element found for ${path}`)
          return
        }

        // Get breadcrumb-list attribute
        const breadcrumbListAttr =
          await breadcrumbElement.getAttribute('breadcrumb-list')

        if (!breadcrumbListAttr) {
          console.log(`  ⚠ No breadcrumb-list attribute found for ${path}`)
          return
        }

        // Parse breadcrumb list as JSON
        let breadcrumbList
        try {
          breadcrumbList = JSON.parse(breadcrumbListAttr)
        } catch (parseError) {
          console.log(
            `  ⚠ Failed to parse breadcrumb-list JSON for ${path}:`,
            parseError
          )
          return
        }

        // Get the last item's label
        if (!Array.isArray(breadcrumbList) || breadcrumbList.length === 0) {
          console.log(`  ⚠ Empty or invalid breadcrumb list for ${path}`)
          return
        }

        const lastBreadcrumb = breadcrumbList[breadcrumbList.length - 1]
        const breadcrumbLabel = lastBreadcrumb?.label?.trim() || ''

        // Get the page's h1 text content
        const h1Element = await page.locator('h1').first()
        const h1Exists = (await h1Element.count()) > 0

        if (!h1Exists) {
          console.log(`  ⚠ No h1 element found for ${path}`)
          return
        }

        const pageTitle = (await h1Element.textContent())?.trim() || ''

        // Compare trimmed values (with optional case-insensitive comparison)
        const breadcrumbCompare = IGNORE_CAPITALIZATION
          ? breadcrumbLabel.toLowerCase()
          : breadcrumbLabel
        const pageTitleCompare = IGNORE_CAPITALIZATION
          ? pageTitle.toLowerCase()
          : pageTitle

        if (breadcrumbCompare !== pageTitleCompare) {
          // Append to CSV results file
          appendCsvRow(RESULTS_FILE, [path, breadcrumbLabel, pageTitle])

          console.log(`  ✗ MISMATCH: ${path}`)
          console.log(`    Breadcrumb: "${breadcrumbLabel}"`)
          console.log(`    Page Title: "${pageTitle}"`)
        } else {
          console.log(`  ✓ Match: ${path}`)
        }
      } catch (error) {
        console.error(`  ✗ Error testing ${path}:`, error)
      }
    })
  }

  test.afterAll(async () => {
    // Read and display summary
    try {
      if (existsSync(RESULTS_FILE)) {
        const fileContent = readFileSync(RESULTS_FILE, 'utf-8')
        const lines = fileContent
          .split('\n')
          .filter((line) => line.trim().length > 0)
        // Subtract 1 for header row
        const mismatchCount = lines.length - 1

        if (mismatchCount > 0) {
          console.log(
            `\n\n=== SUMMARY: Found ${mismatchCount} mismatch(es) ===\n`
          )
          // Display first 10 mismatches
          const displayCount = Math.min(10, mismatchCount)
          for (let i = 1; i <= displayCount; i++) {
            // Simple CSV parsing (handles quoted values)
            const parseCsvLine = (line: string): string[] => {
              const result: string[] = []
              let current = ''
              let inQuotes = false

              for (let j = 0; j < line.length; j++) {
                const char = line[j]
                const nextChar = line[j + 1]

                if (char === '"') {
                  if (inQuotes && nextChar === '"') {
                    current += '"'
                    j++ // Skip next quote
                  } else {
                    inQuotes = !inQuotes
                  }
                } else if (char === ',' && !inQuotes) {
                  result.push(current)
                  current = ''
                } else {
                  current += char
                }
              }
              result.push(current)
              return result
            }

            const [path, breadcrumbTitle, pageTitle] = parseCsvLine(lines[i])
            console.log(`Path: ${path}`)
            console.log(`  Breadcrumb Title: "${breadcrumbTitle}"`)
            console.log(`  Page Title: "${pageTitle}"`)
            console.log('')
          }
          if (mismatchCount > displayCount) {
            console.log(
              `... and ${mismatchCount - displayCount} more (see full results file)\n`
            )
          }
          console.log(`\nFull results saved to: ${RESULTS_FILE}\n`)
        } else {
          console.log(`\n\n=== SUMMARY: No mismatches found ===\n`)
        }
      } else {
        console.log(`\n\n=== SUMMARY: No mismatches found ===\n`)
      }
    } catch (error) {
      console.error('Error reading results file:', error)
    }
  })
})
