type PressReleaseTeaserProps = {
  title: string
}

export function PressReleaseTeaser({ title }: PressReleaseTeaserProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  )
}
