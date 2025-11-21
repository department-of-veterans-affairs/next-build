/* eslint-disable no-console */
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { PAGE_RESOURCE_TYPES } from '../../src/lib/constants/resourceTypes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface BreadcrumbItem {
  uri?: string
  title?: string
  href?: string
  label?: string
}

interface EntityData {
  id?: string
  breadcrumbs?: BreadcrumbItem[]
  path?: {
    alias?: string
  }
}

interface ResultRow {
  uuid: string
  resourceType: string
  entityPath?: string
  lastBreadcrumbUri?: string
  lastBreadcrumbTitle?: string
  breadcrumbsLength: number
}

async function fetchEntitiesForType(
  resourceType: string,
  limit: number = 4
): Promise<EntityData[]> {
  try {
    const command = `yarn fetch-entity ${resourceType} --collection --limit ${limit} --json`
    const output = execSync(command, {
      encoding: 'utf-8',
      cwd: join(__dirname, '../..'),
    })

    const data = JSON.parse(output.trim())
    // If limit is 1, fetchEntity returns a single object, otherwise an array
    return Array.isArray(data) ? data : [data]
  } catch (error) {
    console.error(`Error fetching ${resourceType}:`, error)
    return []
  }
}

function getLastBreadcrumb(entity: EntityData): {
  uri?: string
  title?: string
} | null {
  if (!entity.breadcrumbs || entity.breadcrumbs.length === 0) {
    return null
  }

  const lastCrumb = entity.breadcrumbs[entity.breadcrumbs.length - 1]
  return {
    uri: lastCrumb.uri,
    title: lastCrumb.title,
  }
}

function escapeCsvValue(value: string | undefined | null): string {
  if (value === undefined || value === null) {
    return ''
  }
  const stringValue = String(value)
  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function generateCsv(rows: ResultRow[]): string {
  const headers = [
    'UUID',
    'Resource Type',
    'Entity Path',
    'Last Breadcrumb URI',
    'Last Breadcrumb Title',
    'Breadcrumbs Length',
  ]

  const csvRows = [
    headers.join(','),
    ...rows.map((row) =>
      [
        escapeCsvValue(row.uuid),
        escapeCsvValue(row.resourceType),
        escapeCsvValue(row.entityPath),
        escapeCsvValue(row.lastBreadcrumbUri),
        escapeCsvValue(row.lastBreadcrumbTitle),
        escapeCsvValue(String(row.breadcrumbsLength)),
      ].join(',')
    ),
  ]

  return csvRows.join('\n')
}

async function main() {
  console.log('Starting breadcrumb analysis...')
  console.log(`Processing ${PAGE_RESOURCE_TYPES.length} resource types...`)

  const results: ResultRow[] = []

  for (const resourceType of PAGE_RESOURCE_TYPES) {
    console.log(`\nFetching entities for ${resourceType}...`)
    const entities = await fetchEntitiesForType(resourceType, 4)

    for (const entity of entities) {
      if (!entity.id) {
        console.warn(`Skipping entity without ID in ${resourceType}`)
        continue
      }

      const lastBreadcrumb = getLastBreadcrumb(entity)
      const breadcrumbsLength = entity.breadcrumbs?.length || 0

      results.push({
        uuid: entity.id,
        resourceType,
        entityPath: entity.path?.alias,
        lastBreadcrumbUri: lastBreadcrumb?.uri,
        lastBreadcrumbTitle: lastBreadcrumb?.title,
        breadcrumbsLength,
      })
    }
  }

  // Generate CSV
  const csvContent = generateCsv(results)
  const outputPath = join(__dirname, '../../breadcrumbs-analysis.csv')
  writeFileSync(outputPath, csvContent, 'utf-8')

  console.log(`\n✅ Analysis complete!`)
  console.log(`📊 Processed ${results.length} entities`)
  console.log(`📄 Results saved to: ${outputPath}`)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

