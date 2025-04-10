export function numberToTimeString(time: number | null): string {
  if (time === null) return ''

  // Extract hours and minutes
  const hours = Math.floor(time / 100)
  const minutes = time % 100

  // Validate hours and minutes
  if (time < 0 || hours > 23 || minutes > 59) {
    throw new Error('Invalid time input')
  }

  // Format with leading zeros and add seconds as "00"
  const hh = hours.toString().padStart(2, '0')
  const mm = minutes.toString().padStart(2, '0')

  return `${hh}:${mm}:00`
}
