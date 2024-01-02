export function formatEventCTA(input: string): string {
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
