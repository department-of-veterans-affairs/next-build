/* eslint-disable no-console */
import util from 'util'
import { program } from 'commander'
import { fetchEntity } from './fetchEntity.ts'

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
  .action(async (resourceType, uuid, options) => {
    const data = await fetchEntity(resourceType, uuid, options)
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
  })

program.parse()
