import Image from '../image'
import { MediaImageType } from '@/types/index'

export const MediaImage = (props: MediaImageType) => {
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
