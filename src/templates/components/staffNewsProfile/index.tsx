export type PersonProfileTeaserProps = {
  title: string
  description?: string
}

export const StaffNewsProfile = ({
  title,
  description,
}: PersonProfileTeaserProps): JSX.Element => {
  return (
    <p className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
      By {title}
      {description ? `, ${description}` : null}
    </p>
  )
}
