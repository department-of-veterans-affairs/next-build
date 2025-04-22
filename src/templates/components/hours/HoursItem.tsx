import { FieldOfficeHours } from '@/types/drupal/field_type'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatHours = (hours: number | null) => {
  if (hours === null || hours === -1) return ''
  if (hours === 0) return 'midnight'
  if (hours === 1200) return 'noon'

  const hoursString = hours.toString().padStart(4, '0')
  const H = parseInt(hoursString.substring(0, 2), 10)
  const h = H % 12 || 12
  const m = hoursString.substring(2)
  const ampm = H < 12 ? 'a.m.' : 'p.m.'
  return `${h}:${m} ${ampm}`
}

export const HoursItem = ({ item }: { item: FieldOfficeHours }) => {
  const is24Hours =
    item.starthours === 0 && item.endhours === 0 && !item.comment
  const isClosed =
    (item.starthours === null || item.starthours === -1) &&
    (item.endhours === null || item.endhours === -1) &&
    !item.comment

  const renderHours = () => {
    if (is24Hours) {
      return 'Open 24 hours'
    }

    if (isClosed) {
      return 'Closed'
    }

    const start =
      item.starthours !== null && item.starthours !== -1
        ? formatHours(item.starthours)
        : ''
    const end =
      item.endhours !== null && item.endhours !== -1
        ? formatHours(item.endhours)
        : ''

    const timeRange = [start, end].filter(Boolean).join(' to ')

    return (
      <>
        {timeRange}
        {item.comment && <> {item.comment}</>}
      </>
    )
  }

  return (
    <li>
      <strong
        className="vads-u-display--inline-block"
        style={{ width: '2.5em' }}
      >
        {dayNames[item.day % 7]}:
      </strong>
      <span> {renderHours()}</span>
    </li>
  )
}
