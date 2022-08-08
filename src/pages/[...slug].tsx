import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/utils/drupalClient'
import { entityMeta } from '@/lib/delegators/entityMetaProvider'
import { NodeTypes } from '@/types/node'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
import Layout from '@/components/layout'
import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'

interface EntityProps {
  entityProps: any
}

/** Return the layout and primary component and props. */
export default function Page({ entityProps, props }) {
  const Component = entityMeta[entityProps.type].component

  return (
    <Layout {...props}>
      <Component {...entityProps} />
    </Layout>
  )
}

/** All active node types are identified by the keys of the collected node meta info. */
const resourceTypes = Object.keys(entityMeta)

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
): Promise<GetStaticPropsResult<EntityProps>> {
  const params = new DrupalJsonApiParams()
  const path = await drupalClient.translatePathFromContext(context)

  if (!path || !resourceTypes.includes(path.jsonapi.resourceName)) {
    return {
      notFound: true,
    }
  }

  const type = path.jsonapi.resourceName
  const isCollection = entityMeta[type]?.collection
  // const addResourceToCollection = nodeMeta[type]?.additionalNode
  const defaultProps = entityMeta[type]?.params?.addFilter('status', '1')

  /** Check for isCollection variable to determine if its a single resource or collection*/
  const entity = isCollection
    ? await drupalClient.getResourceCollectionFromContext<NodeTypes>(
        type,
        context,
        {
          params: {
            'filter[drupal_internal__nid][value]': path.entity.id,
            ...entityMeta[type]?.params?.getQueryObject(),
          },
        }
      )
    : await drupalClient.getResourceFromContext<NodeTypes>(path, context, {
        params: entityMeta[type]?.params?.getQueryObject() || defaultProps,
      })

  if (!entity || (!context.preview && entity?.status === false)) {
    return {
      notFound: true,
    }
  }

  const entityProps = generalEntityDataService(entity)

  return {
    props: {
      entityProps,
      ...(await getGlobalElements(context)),
    },
  }
}
