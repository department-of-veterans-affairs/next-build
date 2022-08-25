import Image from 'next/image'

// custom image optimization, no-op
const customLoader = ({ src }) => {
  return src
}

export const ImageComponent = ({ id, src, width, height, alt, className }) => {
  return (
    <Image
      loader={customLoader}
      id={id}
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
    />
  )
}
