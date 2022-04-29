import { StaffProfiles } from '../../partials/staffProfiles'

export const PersonProfile = ({ node }): JSX.Element => {
  if (!node) return
  return <StaffProfiles node={node} />
}
