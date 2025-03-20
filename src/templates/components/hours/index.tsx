import { FieldOfficeHours } from '@/types/drupal/field_type'

type HoursProps = {
  allHours: FieldOfficeHours[]
  headerType:
    | 'small'
    | 'standard'
    | 'clinical'
    | 'office'
    | 'nonTraditionalHours'
}

export const Hours = ({ allHours, headerType }: HoursProps) => {
  if (!allHours || allHours.length === 0) {
    return null
  }

  const formatHours = (hours: number | null) => {
    if (hours === null) return 'Closed'
    const hoursString = hours.toString().padStart(4, '0')
    const H = parseInt(hoursString.substring(0, 2), 10)
    const h = H % 12 || 12
    const m = hoursString.substring(2)
    const ampm = H < 12 ? 'a.m.' : 'p.m.'
    return `${h}:${m} ${ampm}`
  }

  // sort hours so diplay order is monday-sunday
  const sortedHours = [...allHours].sort((a, b) => a.day - b.day)
  const sunday = sortedHours.shift()
  if (sunday) sortedHours.push(sunday)

  const renderHeader = () => {
    switch (headerType) {
      case 'small':
        return (
          <h3 className="force-small-header vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
            Hours
          </h3>
        )
      case 'standard':
      case 'nonTraditionalHours':
        return (
          <h3 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
            Hours
          </h3>
        )
      case 'clinical':
        return (
          <h2 className="vads-u-margin-top--2p5 vads-u-margin-bottom--1">
            Clinical hours
          </h2>
        )
      case 'office':
        return (
          <>
            <h3 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
              Office hours
            </h3>
            <p>
              Hours may vary for different services. Select a service on this
              page to check the hours.
            </p>
          </>
        )
      default:
        return null
    }
  }

  const renderNonTraditionalHours = () => {
    return (
      <p>
        We also have non-traditional hours that change periodically given our
        community’s needs. Please call us to find out more.
      </p>
    )
  }

  return (
    <div className="vads-u-margin-bottom--0" data-template="hours">
      <div className="clinicalhours">
        {renderHeader()}
        <div className="vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row vads-u-margin-bottom--0">
          <ul className="vads-u-flex--1 va-c-facility-hours-list vads-u-margin-top--0 vads-u-margin-bottom--1 mobile-lg:vads-u-margin-bottom--0 vads-u-margin-right--3">
            {sortedHours.map((hoursItem, index) => {
              const dayIndex = hoursItem.day === 0 ? 6 : hoursItem.day - 1
              const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              const DayTag = headerType === 'clinical' ? 'strong' : 'span'
              return (
                <li key={index}>
                  <DayTag className="abbrv-day vads-u-font-weight--bold">
                    {dayNames[dayIndex]}:
                  </DayTag>{' '}
                  {hoursItem.starthours === null
                    ? 'Closed'
                    : `${formatHours(hoursItem.starthours)} to ${formatHours(
                        hoursItem.endhours
                      )}`}
                </li>
              )
            })}
          </ul>
        </div>
        {headerType === 'nonTraditionalHours' && renderNonTraditionalHours()}
      </div>
    </div>
  )
}
