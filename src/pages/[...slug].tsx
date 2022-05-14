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
import NodeNewsStoryPage from '@/components/node/news_story'

interface NodeProps {
  node: DrupalNode
}

export default function NodePage({ node }: NodeProps) {
  if (!node) return null
  return <NodeNewsStoryPage node={node} />
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: await drupalClient.getStaticPathsFromContext(
      RESOURCE_TYPES,
      context,
      {
        params: {},
      }
    ),
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NodeProps>> {
  const path = await drupalClient.translatePathFromContext(context)

  if (!path || !RESOURCE_TYPES.includes(path.jsonapi.resourceName)) {
    return {
      notFound: true,
    }
  }

  const type = path.jsonapi.resourceName

  const node = await drupalClient.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params: getParams(type),
    }
  )

  if (!node || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      node,
    },
  }
}
