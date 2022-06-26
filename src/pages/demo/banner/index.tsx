import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeBanner, NodePromoBanner, NodeResourceType } from '@/types/node'
import Container from '@/components/container'
import Banner from '@/components/node/banner'
import PromoBanner from '@/components/node/promo_banner'

interface BannerPageProps {
  banners: NodeBanner[]
  promoBanners: NodePromoBanner[]
}

const BannerPage = ({ banners, promoBanners }: BannerPageProps) => {
  return (
    <>
      <Container className="container">
        {banners
          ? banners.map((node) => (
              <div key={node.id}>
                <Banner node={node} />
              </div>
            ))
          : null}

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
      </Container>
    </>
  )
}

export default BannerPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<BannerPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addFilter('status', '1')

  const banners = await drupalClient.getResourceCollectionFromContext<
    NodeBanner[]
  >(NodeResourceType.Banner, context, {
    params: params.getQueryObject(),
  })

  const promoBanners = await drupalClient.getResourceCollectionFromContext<
    NodePromoBanner[]
  >(NodeResourceType.PromoBanner, context, {
    params: params.getQueryObject(),
  })

  return {
    props: {
      banners,
      promoBanners,
    },
  }
}
