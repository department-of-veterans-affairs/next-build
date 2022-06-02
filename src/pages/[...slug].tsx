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
  additionalNode: NodeTypes
}

/** This passes any retrieved node to the generalized Node component. */
export default function NodePage({ node, additionalNode }: NodeTypes) {
  if (!node) return null

  return <Node node={node} additionalNode={additionalNode} />
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

  let node
  let additionalNode
  const type = path.jsonapi.resourceName
  const isCollection = nodeMeta[type]?.collection
  const addResourceToCollection = nodeMeta[type]?.additionalNode

  /** Check for is collection variable and determines if it is a collection or a single resource */
  if (!isCollection) {
    node = await drupalClient.getResourceFromContext<NodeTypes>(path, context, {
      params: {
        ...nodeMeta[type].params.getQueryObject(),
      },
    })
  }

  if (isCollection) {
    node = await drupalClient.getResourceCollectionFromContext<NodeTypes>(
      type,
      context,
      {
        params: {
          'filter[drupal_internal__nid][value]': path.entity.id,
          ...nodeMeta[type].params.getQueryObject(),
        },
      }
    )

    /** Check for is additionalNode variable and returns data for additional collection or single resource */
    if (addResourceToCollection) {
      additionalNode =
        await drupalClient.getResourceCollectionFromContext<NodeTypes>(
          addResourceToCollection,
          context,
          {
            params: {
              'filter[field_listing.drupal_internal__nid][value]':
                path.entity.id, // Todo make the filter option dynamic
              ...nodeMeta[type].additionalParams.getQueryObject(),
            },
          }
        )
    }
  }

  if (!node || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      node,
      additionalNode: additionalNode || null,
    },
  }
}
