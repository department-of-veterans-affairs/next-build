export interface FieldLink {
  uri: string
  title: string
}

export interface FieldFormattedText {
  value: string
  format: string
  processed: string
}

export interface FieldFormattedTextWithSummary extends FieldFormattedText {
  summary: string
}
