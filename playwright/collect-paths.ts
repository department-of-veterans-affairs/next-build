/**
 * Script to collect static paths for PAGE_RESOURCE_TYPES and cache them as CSV files
 *
 * Run with: yarn playwright:collect-paths
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { existsSync } from 'fs'
import { PAGE_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { slugToPath } from '@/lib/utils/slug'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

// Load environment variables BEFORE importing anything that depends on Drupal
const __dirname = new URL('.', import.meta.url).pathname
dotenvExpand.expand(
  dotenv.config({
    path: join(__dirname, '../envs/.env.local'),
    override: true,
  })
)

const { getStaticPathsByResourceType } = await import(
  '@/lib/drupal/staticPaths'
)

const OUTPUT_DIR = join(process.cwd(), 'playwright', 'test-paths')

async function collectPaths() {
  console.log('Collecting paths for PAGE_RESOURCE_TYPES...')
  console.log(`Found ${PAGE_RESOURCE_TYPES.length} resource types\n`)

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let totalPaths = 0

  for (const resourceType of PAGE_RESOURCE_TYPES) {
    try {
      console.log(`Fetching paths for ${resourceType}...`)
      const staticPaths = await getStaticPathsByResourceType(resourceType)

      // Convert slug arrays back to paths
      const paths = staticPaths.map((pathObj) => {
        if (typeof pathObj === 'string') {
          return slugToPath(pathObj)
        }
        const slug = pathObj.params.slug
        return slugToPath(slug)
      })

      // Write CSV file (one path per line, no headers)
      const csvFile = join(OUTPUT_DIR, `${resourceType}.csv`)
      const csvContent = paths.join('\n')
      writeFileSync(csvFile, csvContent, 'utf-8')

      totalPaths += paths.length
      console.log(`  ✓ Collected ${paths.length} paths -> ${csvFile}\n`)
    } catch (error) {
      console.error(`  ✗ Error collecting paths for ${resourceType}:`, error)
    }
  }

  console.log(`\n✓ Paths cached to ${OUTPUT_DIR}`)
  console.log(`\nTotal paths collected: ${totalPaths}`)
}

collectPaths().catch((error) => {
  console.error('Error collecting paths:', error)
  process.exit(1)
})
