export function dayOfWeek(day: number): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  if (Number.isNaN(day) || day < 0 || day > days.length - 1)
    throw new Error('Invalid day of week')

  return days[day]
}
