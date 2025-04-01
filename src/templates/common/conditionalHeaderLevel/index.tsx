export function ConditionalHeaderLevel({
  headerLevel,
  children,
  passThroughId,
  ...otherProps
}: {
  headerLevel: number
  children: React.ReactNode
  passThroughId: string
  slot?: string
}) {
  if (
    typeof headerLevel !== 'number' ||
    headerLevel < 2 ||
    headerLevel > 6 ||
    !passThroughId
  ) {
    return null
  }
  switch (headerLevel) {
    case 2:
      return (
        <h2 {...otherProps} id={passThroughId}>
          {children}
        </h2>
      )
    case 3:
      return (
        <h3 {...otherProps} id={passThroughId}>
          {children}
        </h3>
      )
    case 4:
      return (
        <h4 {...otherProps} id={passThroughId}>
          {children}
        </h4>
      )
    case 5:
      return (
        <h5 {...otherProps} id={passThroughId}>
          {children}
        </h5>
      )
  }
  return (
    <h6 {...otherProps} id={passThroughId}>
      {children}
    </h6>
  )
}
