import { PersonProfiles } from '../../partials/personProfiles'

export const PersonProfile = ({ node }): JSX.Element => {
  if (!node) return
  return <PersonProfiles node={node} />
}
