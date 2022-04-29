import { StaffProfiles } from '../../partials/staffProfiles'

export const StaffProfile = ({ node }): JSX.Element => {
  if (!node) return
  return <StaffProfiles node={node} />
}
