import { NodeHealthCareLocalHealthService } from '@/types/drupal/node'

export const HealthServices = ({
  healthServices,
}: {
  healthServices: NodeHealthCareLocalHealthService[]
}) => {
  return (
    <>
      <h2
        id="health-care-offered-here"
        className="vads-u-font-size--xl vads-u-margin-top--5"
      >
        Health services offered here
      </h2>
      <p>Select a topic to learn more.</p>
    </>
  )
}
