import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePromoBanner, NodeResourceType } from '@/types/node'

import Layout from '@/components/layout'
import PromoBanner from '@/components/node/promo_banner'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
interface BannerPageProps {
  promoBanners?: NodePromoBanner[]
  bannerData?: any
  props?: any
}

const BannerPage = ({ props, promoBanners }: BannerPageProps) => {
  return (
    <Layout {...props}>
      {/*Maintenance banner*/}
      <div
        aria-label="Maintenance banner"
        data-widget-type="maintenance-banner"
        role="region"
      ></div>

      {promoBanners
        ? promoBanners.map((node) => (
            <div key={node.id}>
              <PromoBanner node={node} />
            </div>
          ))
        : null}
    </Layout>
  )
}

export default BannerPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<BannerPageProps>> {
  const params = new DrupalJsonApiParams()

  const promoBanners = await drupalClient.getResourceCollectionFromContext<
    NodePromoBanner[]
  >(NodeResourceType.PromoBanner, context, {
    params: params.getQueryObject(),
  })

  return {
    props: {
      ...(await getGlobalElements(context)),
      promoBanners,
    },
    // will be passed to the page component as promoBanners,
  }
}
