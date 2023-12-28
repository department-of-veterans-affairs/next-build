import Image from '../image'
import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'

// TODO: Do we need this component? It appears to be an unnecessary wrapper.
// I think we can probably combine this into Image. We do need a way to use different image styles, though. This currently is not doing that.
export const MediaImage = (props: FormattedMediaImage) => {
  return (
    <Image
      id={props.id}
      alt={props.alt}
      src={props.url}
      width={props.width}
      height={props.height}
      title={props.title}
      className={props?.className}
    />
  )
}
