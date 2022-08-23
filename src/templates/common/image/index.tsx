import Image from 'next/image'

// opt-out of image optimization, no-op
const customLoader = ({ src }) => {
  return src
}

export const ImageComponent = ({
  id,
  src,
  width,
  height,
  alt,
  title,
  className,
}) => {
  return (
    <Image
      loader={customLoader}
      id={id}
      src={src}
      width={width}
      height={height}
      alt={alt}
      title={title}
      className={className}
    />
  )
}
