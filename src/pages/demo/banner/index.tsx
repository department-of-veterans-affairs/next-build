import { Wrapper } from '@/templates/globals/wrapper'
import { isEmpty } from 'lodash'
import { BannerProps } from '@/templates/globals/banners/banner'
import { getGlobalElements } from '@/lib/context/getGlobalElements'

interface BannerPageProps {
  props?: BannerProps | null
}

const BannerPage = ({ props }: BannerPageProps) => {
  if (isEmpty(props)) return null

  return (
    <Wrapper {...props}>
      <div
        aria-label="Maintenance banner"
        data-widget-type="maintenance-banner"
        role="region"
      ></div>
    </Wrapper>
  )
}

export default BannerPage

export async function getStaticProps(context) {
  return {
    props: {
      ...(await getGlobalElements(context)),
    }, // will be passed to the page component as props
  }
}
