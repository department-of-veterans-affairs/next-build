import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { BlockAlert, BlockContentResourceType } from '@/types/block'
import { AlertBlock } from '@/components/alert'

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
        content: generalEntityDataService(entity.field_alert_content),
      }
  }
}

export const Meta: EntityMetaInfo = {
  resource: BlockContentResourceType.Alert,
  component: AlertBlock,
  dataService: alertBlockDataService,
}
