import { FieldAdministration } from '@/types/drupal/field_type'

export interface Administration {
  entityId: number
  name: string | null
}

/**
 * Formats a Drupal administration field into our standardized Administration interface.
 * 
 * In our Drupal content, the `field_administration` field points to a taxonomy Term
 * that is currently called "Section", but "Section" is only a human label added to
 * it in the Drupal interface, and that name has evolved over time. It was originally,
 * "administration" (and thus the name of the field). Since the only machine name of
 * it is `field_administration`, we'll continue to call it "administration" in our code.
 */
export const formatAdministration = (
  administration: FieldAdministration | null | undefined
): Administration => ({
  entityId: administration?.drupal_internal__tid || null, // "t" is for taxonomy term
  name: administration?.name || null,
})
