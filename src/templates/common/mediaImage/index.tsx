import Image from '../image'
import { MediaImage as FormattedMediaImage } from '@/types/dataTypes/formatted/media'

// TODO: Do we need this component? It appears to be an unnecessary wrapper.
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
