type CampaignLandingPageProps = {
  title: string
}

export function CampaignLandingPage({ title }: CampaignLandingPageProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  )
}
