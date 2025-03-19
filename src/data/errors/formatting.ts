export class FormattingError extends Error {
  constructor(missingField: string) {
    super(`Error formatting featured content: missing ${missingField}`)
  }
}
