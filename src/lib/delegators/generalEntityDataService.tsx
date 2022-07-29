import { entityMeta } from '@/lib/delegators/entityMetaProvider'
import debug from 'debug'

export const generalEntityDataService = function(entity, viewMode = 'full') {
  const entityType = entity.type
  if (entity.type) {
    const entityDataService = entityMeta[entityType].dataService
    if (entityDataService) {
      return {
        ...entityDataService(entity, viewMode),
        type: entity.type,
      }
    }
    else {
      debug("No dataService found for {entity}")
    }
  }
  else {
    debug("No valid entity type found on {entity}")
  }
}
