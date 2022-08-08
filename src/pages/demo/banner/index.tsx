import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePromoBanner, NodeResourceType } from '@/types/node'
import Container from '@/components/container'
import { Banner } from '@/components/banner'
import PromoBanner from '@/components/node/promo_banner'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
interface BannerPageProps {
  promoBanners?: NodePromoBanner[]
  bannerData?: any
  props?: any
}

const BannerPage = (props, { promoBanners }: BannerPageProps) => {
  const { bannerData } = props.props
  return (
    <>
      <Container className="container">
        {bannerData ? <Banner {...bannerData} /> : null}

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

  const promoBanners = await drupalClient.getResourceCollectionFromContext<
    NodePromoBanner[]
  >(NodeResourceType.PromoBanner, context, {
    params: params.getQueryObject(),
  })

  return {
    props: {
      promoBanners,
      ...(await getGlobalElements(context)),
    },
    // will be passed to the page component as promoBanners,
  }
}
