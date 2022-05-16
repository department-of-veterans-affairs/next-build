import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { drupalClient } from '@/utils/drupalClient'
import { Node, nodeMeta } from '@/components/node'
import { NodeTypes } from '@/types/node'

interface NodeProps {
  node: NodeTypes
}

/** This passes any retrieved node to the generalized Node component. */
export default function NodePage({ node }: NodeTypes) {
  if (!node) return null
  return <Node node={node} />
}

/** All active node types are identified by the keys of the collected node meta info. */
const resourceTypes = Object.keys(nodeMeta)

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: await drupalClient.getStaticPathsFromContext(
      resourceTypes,
      context,
      {
        params: {},
      }
    ),
    fallback: 'blocking',
  }
}

/** @todo This cannot handle non-node urls yet. */
export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NodeProps>> {
  const path = await drupalClient.translatePathFromContext(context)

  if (!path || !resourceTypes.includes(path.jsonapi.resourceName)) {
    return {
      notFound: true,
    }
  }

  const type = path.jsonapi.resourceName

  const node = await drupalClient.getResourceFromContext<NodeTypes>(
    path,
    context,
    {
      params: nodeMeta[type].params.getQueryObject(),
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
