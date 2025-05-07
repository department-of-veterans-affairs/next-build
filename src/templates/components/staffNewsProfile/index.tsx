export type PersonProfileTeaserProps = {
  field_name_first?: string
  field_last_name?: string
  field_description?: string
}

export const StaffNewsProfile = ({
  field_name_first,
  field_last_name,
  field_description,
}: PersonProfileTeaserProps): JSX.Element | null => {
  const name = `${field_name_first || ''} ${field_last_name || ''}`.trim()
  if (!name) return null

  return (
    <p className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
      By {name}
      {field_description ? `, ${field_description}` : ''}
    </p>
  )
}
