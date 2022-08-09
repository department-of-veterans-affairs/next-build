import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeBanner, NodePromoBanner, NodeResourceType } from '@/types/data-types/drupal/node'
import Container from 'templates/common/container'
import { Banner } from 'templates/banner'
import Layout from '@/templates/globals/layout'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
import PromoBanner from 'templates/globals/promo_banner'

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
