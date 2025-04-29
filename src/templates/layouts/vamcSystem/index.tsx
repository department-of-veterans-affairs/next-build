type VamcSystemProps = {
  title: string
}

export function VamcSystem({ title }: VamcSystemProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  )
}
