import { test } from '../utils/next-test'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Configuration constants
const CSV_FILE = join(process.cwd(), 'breadcrumbs-test-paths.csv')
const RESULTS_DIR = join(process.cwd(), 'playwright', 'test-results-breadcrumb')
const RESULTS_FILE = join(RESULTS_DIR, 'breadcrumbs-comparison.csv')

const LOCALHOST_URL = 'http://localhost:3999'
const PROD_URL = 'https://www.va.gov'

interface TestPath {
  resourceType: string
  entityPath: string
}

interface BreadcrumbData {
  breadcrumbLabel: string
  pageTitle: string
}

// Helper function to parse CSV
function parseCsv(csvContent: string): TestPath[] {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())
  const rows: TestPath[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values: string[] = []
    let currentValue = ''
    let inQuotes = false

    // Parse CSV line handling quoted values
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          currentValue += '"'
          j++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim())
        currentValue = ''
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim())

    if (values.length === headers.length) {
      const resourceTypeIndex = headers.indexOf('Resource Type')
      const entityPathIndex = headers.indexOf('Entity Path')

      if (resourceTypeIndex >= 0 && entityPathIndex >= 0) {
        rows.push({
          resourceType: values[resourceTypeIndex],
          entityPath: values[entityPathIndex],
        })
      }
    }
  }

  return rows
}

// Helper function to normalize strings for comparison
function normalizeString(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, ' ')
}

// Helper function to check if two strings differ only by casing/whitespace
function differsOnlyByCasingOrWhitespace(str1: string, str2: string): boolean {
  return normalizeString(str1) === normalizeString(str2)
}

// Helper function to get difference type
function getDifferenceType(
  str1: string,
  str2: string
): 'none' | 'casing-whitespace' | 'different' {
  if (str1.trim() === str2.trim()) {
    return 'none'
  }
  if (differsOnlyByCasingOrWhitespace(str1, str2)) {
    return 'casing-whitespace'
  }
  return 'different'
}

// Helper function to extract breadcrumb and page title
async function extractBreadcrumbData(
  page: any,
  url: string
): Promise<BreadcrumbData | null> {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // Check if va-breadcrumbs element exists
    const breadcrumbElement = await page.locator('va-breadcrumbs').first()
    const breadcrumbExists = (await breadcrumbElement.count()) > 0

    if (!breadcrumbExists) {
      return null
    }

    // Get breadcrumb-list attribute
    const breadcrumbListAttr =
      await breadcrumbElement.getAttribute('breadcrumb-list')

    if (!breadcrumbListAttr) {
      return null
    }

    // Parse breadcrumb list as JSON
    let breadcrumbList
    try {
      breadcrumbList = JSON.parse(breadcrumbListAttr)
    } catch {
      return null
    }

    // Get the last item's label
    if (!Array.isArray(breadcrumbList) || breadcrumbList.length === 0) {
      return null
    }

    const lastBreadcrumb = breadcrumbList[breadcrumbList.length - 1]
    const breadcrumbLabel = lastBreadcrumb?.label?.trim() || ''

    // Get the page's h1 text content
    const h1Element = await page.locator('h1').first()
    const h1Exists = (await h1Element.count()) > 0

    if (!h1Exists) {
      return null
    }

    const pageTitle = (await h1Element.textContent())?.trim() || ''

    return { breadcrumbLabel, pageTitle }
  } catch (error) {
    console.error(`Error extracting data from ${url}:`, error)
    return null
  }
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
    const existingContent = readFileSync(filePath, 'utf-8')
    writeFileSync(filePath, existingContent + csvRow, 'utf-8')
  } else {
    const header =
      'path,resourceType,localhostBreadcrumb,localhostTitle,prodBreadcrumb,prodTitle,localhostMatch,prodMatch,localhostProdDiff,localhostProdBreadcrumbDiff,localhostProdTitleDiff\n'
    writeFileSync(filePath, header + csvRow, 'utf-8')
  }
}

// Load test paths from CSV
let testPaths: TestPath[] = []

try {
  const fileContent = readFileSync(CSV_FILE, 'utf-8')
  testPaths = parseCsv(fileContent)
  console.log(`\nLoaded ${testPaths.length} paths from ${CSV_FILE}\n`)
} catch (error) {
  console.error(`Error loading ${CSV_FILE}:`, error)
  throw error
}

if (testPaths.length === 0) {
  console.warn(`No paths found in ${CSV_FILE}`)
}

// Ensure results directory exists
if (!existsSync(RESULTS_DIR)) {
  mkdirSync(RESULTS_DIR, { recursive: true })
}

test.describe('Breadcrumbs Comparison Test', () => {
  // Disable parallel execution to avoid file write race conditions
  test.describe.configure({ mode: 'serial' })

  for (const testPath of testPaths) {
    test(`Compare breadcrumbs for ${testPath.entityPath}`, async ({ page }) => {
      const localhostUrl = `${LOCALHOST_URL}${testPath.entityPath}`
      const prodUrl = `${PROD_URL}${testPath.entityPath}`

      console.log(`\nTesting: ${testPath.entityPath}`)

      // Extract data from localhost
      console.log(`  Fetching localhost...`)
      const localhostData = await extractBreadcrumbData(page, localhostUrl)

      // Extract data from production
      console.log(`  Fetching production...`)
      const prodData = await extractBreadcrumbData(page, prodUrl)

      if (!localhostData || !prodData) {
        console.log(`  ⚠ Missing data - skipping`)
        if (!localhostData) {
          console.log(`    Localhost: No breadcrumb data found`)
        }
        if (!prodData) {
          console.log(`    Production: No breadcrumb data found`)
        }
        return
      }

      // Compare breadcrumb with page title for each environment
      const localhostMatch = differsOnlyByCasingOrWhitespace(
        localhostData.breadcrumbLabel,
        localhostData.pageTitle
      )
      const prodMatch = differsOnlyByCasingOrWhitespace(
        prodData.breadcrumbLabel,
        prodData.pageTitle
      )

      // Compare localhost vs production
      const localhostProdBreadcrumbDiff = getDifferenceType(
        localhostData.breadcrumbLabel,
        prodData.breadcrumbLabel
      )
      const localhostProdTitleDiff = getDifferenceType(
        localhostData.pageTitle,
        prodData.pageTitle
      )

      // Determine overall difference type
      let localhostProdDiff: 'none' | 'casing-whitespace' | 'different' = 'none'
      if (
        localhostProdBreadcrumbDiff === 'different' ||
        localhostProdTitleDiff === 'different'
      ) {
        localhostProdDiff = 'different'
      } else if (
        localhostProdBreadcrumbDiff === 'casing-whitespace' ||
        localhostProdTitleDiff === 'casing-whitespace'
      ) {
        localhostProdDiff = 'casing-whitespace'
      }

      // Log results
      if (!localhostMatch) {
        console.log(`  ✗ Localhost mismatch:`)
        console.log(`    Breadcrumb: "${localhostData.breadcrumbLabel}"`)
        console.log(`    Page Title: "${localhostData.pageTitle}"`)
      } else {
        console.log(`  ✓ Localhost match`)
      }

      if (!prodMatch) {
        console.log(`  ✗ Production mismatch:`)
        console.log(`    Breadcrumb: "${prodData.breadcrumbLabel}"`)
        console.log(`    Page Title: "${prodData.pageTitle}"`)
      } else {
        console.log(`  ✓ Production match`)
      }

      if (localhostProdDiff !== 'none') {
        console.log(
          `  ⚠ Localhost vs Production difference: ${localhostProdDiff}`
        )
        if (localhostProdBreadcrumbDiff !== 'none') {
          console.log(
            `    Breadcrumb diff (${localhostProdBreadcrumbDiff}): "${localhostData.breadcrumbLabel}" vs "${prodData.breadcrumbLabel}"`
          )
        }
        if (localhostProdTitleDiff !== 'none') {
          console.log(
            `    Title diff (${localhostProdTitleDiff}): "${localhostData.pageTitle}" vs "${prodData.pageTitle}"`
          )
        }
      }

      // Write to CSV if there are any issues
      if (!localhostMatch || !prodMatch || localhostProdDiff !== 'none') {
        appendCsvRow(RESULTS_FILE, [
          testPath.entityPath,
          testPath.resourceType,
          localhostData.breadcrumbLabel,
          localhostData.pageTitle,
          prodData.breadcrumbLabel,
          prodData.pageTitle,
          localhostMatch ? 'true' : 'false',
          prodMatch ? 'true' : 'false',
          localhostProdDiff,
          localhostProdBreadcrumbDiff,
          localhostProdTitleDiff,
        ])
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
        const issueCount = lines.length - 1 // Subtract header row

        if (issueCount > 0) {
          console.log(`\n\n=== SUMMARY: Found ${issueCount} issue(s) ===\n`)
          console.log(`Results saved to: ${RESULTS_FILE}\n`)
        } else {
          console.log(`\n\n=== SUMMARY: No issues found ===\n`)
        }
      } else {
        console.log(`\n\n=== SUMMARY: No issues found ===\n`)
      }
    } catch (error) {
      console.error('Error reading results file:', error)
    }
  })
})
