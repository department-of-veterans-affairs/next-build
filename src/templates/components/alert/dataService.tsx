import { generalEntityDataService } from '@/data/delegators/generalEntityDataService'
import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'
import {
  BlockAlert,
  BlockContentResourceType,
} from '@/types/dataTypes/drupal/block'
import { AlertBlock } from '@/templates/components/alert'

const alertBlockDataService = function (entity: BlockAlert, viewMode: string) {
  switch (viewMode) {
    default:
      return {
        alertType:
          entity.field_alert_type === 'information'
            ? 'info'
            : entity.field_alert_type,
        id: entity.id,
        title: entity.field_alert_title,
        // commented out while we're finishing up the queries refactor.
        content: {}, //generalEntityDataService(entity.field_alert_content),
      }
  }
}

export const Meta: EntityMetaInfo = {
  resource: BlockContentResourceType.Alert,
  component: AlertBlock,
  dataService: alertBlockDataService,
}
