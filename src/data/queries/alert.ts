// Define the query params for fetching block--alert.
import { BlockAlert } from '@/types/drupal/block'
import { QueryFormatter } from 'next-drupal-query'
import { Alert } from '@/types/formatted/alert'
import { transformAlertData } from '@/lib/drupal/query'

export const formatter: QueryFormatter<BlockAlert, Alert> = (
  entity: BlockAlert
) => {
  return transformAlertData(entity)
}
