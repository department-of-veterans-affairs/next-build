type LeadershipListingProps = {
  title: string
}

export function LeadershipListing({ title }: LeadershipListingProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  )
}
