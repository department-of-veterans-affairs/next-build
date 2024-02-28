
import { FieldFormattedText } from "../drupal/field_type"
export type QaParagraph = {
  question: string
  answers: FieldFormattedText[]
  type: string
  id: number
}
