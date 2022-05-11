import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import {
  DrupalNode,
  JsonApiResource,
  getResourceFromContext,
} from 'next-drupal'
import { drupalClient } from '@/utils/drupalClient'
import { getParams } from '@/lib/get-params'
import { RESOURCE_TYPES } from '@/lib/constants'

interface PageProps {
  node: JsonApiResource
}

export default function NodePage({ node }) {
  if (!node) return null
  return (
    <>
      <div>{node.type === 'node--q_a' && <h2>{node.title}</h2>}</div>
    </>
  )
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    // Build static paths for all resource types.
    paths: await drupalClient.getStaticPathsFromContext(
      RESOURCE_TYPES,
      context,
      {
        params: {
          filter: {
            'field_site.meta.drupal_internal__target_id':
              process.env.DRUPAL_SITE_ID,
          },
        },
      }
    ),

    // If a path is requested and is not static, Next.js will call getStaticProps and try to find it.
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> {
  const path = await drupalClient.translatePathFromContext(context)
  const type = path?.jsonapi.resourceName

  if (!RESOURCE_TYPES.includes(type)) {
    return {
      notFound: true,
    }
  }

  const node = await getResourceFromContext<JsonApiResource>(type, context, {
    params: getParams(type),
  })

  if (!node) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
  }

  if (!context.preview && node?.status === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      node: node || null,
    },
  }
}
