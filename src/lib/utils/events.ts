import { deriveFormattedTimestamp } from './date'

export function formatEventCTA(input: string): string {
  if (!input) {
    return
  }

  if (input.toLowerCase() === 'rsvp') {
    return 'RSVP'
  }

  const words: string[] = input.split('_')

  const formattedString: string = words
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      } else {
        return word
      }
    })
    .join(' ')

  return formattedString
}

export function createMailToLink(emailCTA, title, mostRecentDate, linkPath) {
  const formattedDate = deriveFormattedTimestamp(mostRecentDate)
  const subject = `RSVP for ${title} on ${formattedDate}`
  const body = `I would like to register for ${title} on ${formattedDate}. (https://va.gov${
    linkPath || ''
  })`

  return `mailto:${emailCTA}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`
}
