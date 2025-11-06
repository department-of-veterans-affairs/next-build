/* eslint-disable no-console */

import { program } from 'commander'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import util from 'util'
import { deflateObjectGraph } from '../../../src/lib/utils/object-graph.ts'

import { getEnvFileVars } from './getEnvVars.ts'

process.env = {
  ...process.env,
  ...getEnvFileVars(),
}

const { drupalClient } = await import('./drupalClient.ts')

// The username & password will let us apply filters, so prefer that
// Fall back to the client ID and secret otherwise
const withAuth = process.env.DRUPAL_USERNAME
  ? {
      username: process.env.DRUPAL_USERNAME,
      password: process.env.DRUPAL_PASSWORD,
    }
  : {
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
    }

program
  .description(
    'Fetch a resource from the Drupal JSON:API. Useful for grabbing mock data.'
  )
  .argument('<resource-type>', 'The resource type to fetch')
  .argument(
    '[uuid]',
    'The ID of the resource to fetch (optional if using --collection)'
  )
  .option(
    '--include <includes...>',
    'Dot-notated, space-separated includes (e.g. field_telephone field_region_page.field_related_links.field_va_paragraphs)'
  )
  .option('--json', 'Output as JSON. Beware of circular references!')
  .option('--deflate', 'Deflate the output to remove circular references')
  .option(
    '--collection',
    'Fetch a collection of resources instead of a single resource'
  )
  .option(
    '--limit <limit>',
    'Limit the number of resources to fetch (only with --collection)',
    '1'
  )
  .action(
    async (
      resourceType: string,
      uuid?: string,
      options: {
        include?: string[]
        json?: boolean
        deflate?: boolean
        collection?: boolean
        limit?: string
      }
    ) => {
      // Validate arguments
      if (!options.collection && !uuid) {
        console.error(
          'Error: UUID is required when not using --collection mode'
        )
        process.exit(1)
      }

      const params = new DrupalJsonApiParams()
      if (options.include?.length) {
        params.addInclude(options.include)
      }

      let data: unknown

      if (options.collection) {
        // Fetch collection of resources
        const limit = parseInt(options.limit || '1', 10)
        params.addPageLimit(limit)

        const collection = await drupalClient.getResourceCollection(
          resourceType,
          {
            params: params.getQueryObject(),
            // @ts-expect-error It's possible for the env vars to not be set properly
            withAuth,
          }
        )

        // If limit is 1, return just the first item, otherwise return the array
        data = limit === 1 && collection.length > 0 ? collection[0] : collection
      } else {
        // Fetch single resource by UUID
        data = await drupalClient.getResource(resourceType, uuid!, {
          params: params.getQueryObject(),
          // @ts-expect-error It's possible for the env vars to not be set properly
          withAuth,
        })
      }

      if (options.deflate) {
        data = deflateObjectGraph(data)
      }

      // NOTE: There may be a thing we can do to just _check_ for circular
      // references. console.log(util.format('%j', data)) will output just
      // "[Circular]" if there are circular references.

      if (options.json) {
        console.log(JSON.stringify(data, null, 2))
      } else {
        // If we're printing to the terminal, pretty print with colors.
        // NOTE: This is not proper JSON. (No quotes around property names.)
        console.log(
          util.inspect(data, { depth: null, colors: process.stdout.isTTY })
        )
      }
    }
  )

program.parse()
