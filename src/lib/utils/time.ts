const MINUTE = 60
const HOUR = MINUTE * 60

export const secondsToDurationLabel = (durationSeconds: number | null) => {
  if (durationSeconds === null) {
    return null
  }

  const pad = (t: number) => `${t}`.padStart(2, '0')

  const hours = Math.floor(durationSeconds / HOUR)
  const minutes = Math.floor((durationSeconds % HOUR) / MINUTE)
  const seconds = durationSeconds % MINUTE

  if (minutes === 0 && hours === 0) {
    return `${seconds} seconds`
  }

  if (hours === 0) {
    return `${minutes}:${pad(seconds)} minutes`
  }

  return `${hours}:${pad(minutes)} hours`
}
