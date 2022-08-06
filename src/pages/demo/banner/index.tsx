import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeBanner, NodePromoBanner, NodeResourceType } from '@/types/node'
import Container from '@/components/container'
import { Banner, BannerProps } from '@/components/banner'
import PromoBanner from '@/components/node/promo_banner'
import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'
import { transformBannerDataService } from '@/components/banner/dataService'
interface BannerPageProps {
  banner: BannerProps
  promoBanners: NodePromoBanner[]
}

const BannerPage = ({ banner, promoBanners }: BannerPageProps) => {
  return (
    <>
      <Container className="container">
        {banner ? <Banner {...transformBannerDataService({ banner })} /> : null}

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
  const banner = generalEntityDataService(banners)
  return {
    props: {
      banner,
      promoBanners,
    },
  }
}
