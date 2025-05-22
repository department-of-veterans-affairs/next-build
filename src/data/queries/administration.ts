import { FieldAdministration } from '@/types/drupal/field_type'

/**
 * Returns an id used to identify the administration, which we will sometimes use to
 * identify a specific administrative area, like Lovell.
 *
 * In our Drupal content, the `field_administration` field points to a taxonomy Term
 * that is currently called "Section", but "Section" is only a human label added to
 * it in the Drupal interface, and that name has evolved over time. It was originally,
 * "administration" (and thus the name of the field). Since the only machine name of
 * it is `field_administration`, we'll continue to call it "administration" in our code.
 */
export const getAdministrationId = (
  administration: FieldAdministration | null | undefined
): number => administration?.drupal_internal__tid // "t" is for taxonomy term
