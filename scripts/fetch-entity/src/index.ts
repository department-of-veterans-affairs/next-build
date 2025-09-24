/* eslint-disable no-console */

import { program } from 'commander'
import { fetchEntity } from './fetchEntity'

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
  .action(fetchEntity)

program.parse()
