export interface Administration {
  /**
   * This is the internal Drupal id of the administration term. See the administration
   * formatter function comments for more details.
   */
  entityId: number | null
  /**
   * The human-readable name of the administration term.
   */
  name: string | null
}
