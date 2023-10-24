import NextImage, { ImageProps } from 'next/image'
import customLoader from './customLoader'

export default function Image(props: ImageProps) {
  return <NextImage unoptimized {...props} loader={customLoader} />
}
