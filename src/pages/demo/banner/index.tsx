import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeBanner,
  NodePromoBanner,
  NodeResourceType,
} from '@/types/dataTypes/drupal/node'
import { Wrapper } from '@/templates/globals/wrapper'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
import PromoBanner from '@/templates/globals/banners/promoBanner'

interface BannerPageProps {
  promoBanners?: NodePromoBanner[]
  bannerData?: any
  props?: any
}

const BannerPage = ({ props, promoBanners }: BannerPageProps) => {
  return (
    <Wrapper {...props}>
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
    </Wrapper>
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
