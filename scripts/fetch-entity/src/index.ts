/* eslint-disable no-console */

/**
 * Note: This script only works with Node or ts-node, not Bun or Deno.
 */

import { program } from 'commander'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import util from 'util'

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
  .argument('<uuid>', 'The ID of the resource to fetch')
  .option(
    '--include <includes...>',
    'Dot-notated, space-separated includes (e.g. field_telephone field_region_page.field_related_links.field_va_paragraphs)'
  )
  .option('--json', 'Output as JSON. Beware of circular references!')
  .action(
    async (
      resourceType: string,
      uuid: string,
      options: { include?: string[]; json?: boolean }
    ) => {
      const params = new DrupalJsonApiParams()
      if (options.include?.length) {
        params.addInclude(options.include)
      }

      const data = await drupalClient.getResource(resourceType, uuid, {
        params: params.getQueryObject(),
        // @ts-expect-error It's possible for the env vars to not be set properly
        withAuth,
      })

      if (options.json) {
        // If we're piping or redirecting, print as JSON.
        // E.g. `node ... | pbcopy` or `node ... > data.json`
        console.log(JSON.stringify(data, null, 2))
        // console.log(util.format('%j', data)) will output just "[Circular]" if
        // there are circular references
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
