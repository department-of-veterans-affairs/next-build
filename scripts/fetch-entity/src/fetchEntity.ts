import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
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

export async function fetchEntity(
  resourceType: string,
  uuid?: string,
  options: {
    include?: string[]
    deflate?: boolean
    collection?: boolean
    limit?: string
  } = {}
) {
  // Validate arguments
  if (!options.collection && !uuid) {
    console.error('Error: UUID is required when not using --collection mode')
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

    const collection = await drupalClient.getResourceCollection(resourceType, {
      params: params.getQueryObject(),
      // @ts-expect-error It's possible for the env vars to not be set properly
      withAuth,
    })

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

  return data
}
