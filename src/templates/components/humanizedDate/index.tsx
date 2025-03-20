import { fromUnixTime, isValid, parse } from 'date-fns'
import { format } from 'date-fns-tz'

export function HumanizedDate({
  date,
  changed,
}: {
  date?: string
  changed?: number
}) {
  if (!date && !changed) {
    return null
  }
  const parseFormat = "yyyy-MM-dd'T'HH:mm:ssXXX"
  const dateValue = date
    ? parse(date, parseFormat, new Date())
    : fromUnixTime(changed)
  if (!isValid(dateValue)) {
    return null
  }
  return (
    <p data-testid="last-updated-formatted">
      Last updated:{' '}
      <time dateTime={format(dateValue, 'yyyy-MM-dd')}>
        {format(dateValue, 'MMMM d, yyyy', { timeZone: 'America/New_York' })}
      </time>
    </p>
  )
}
