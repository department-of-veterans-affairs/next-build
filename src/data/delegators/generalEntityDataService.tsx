import { entityMeta } from 'data/delegators/entityMetaProvider'
import debug from 'debug'

export const entityDataServiceLookup = function (entity, viewMode = 'full') {
  const entityType = entity.type
  if (entity.type) {
    const entityDataService = entityMeta[entityType].dataService
    if (entityDataService) {
      return {
        ...entityDataService(entity, viewMode),
        type: entity.type,
      }
    } else {
      debug('No dataService found for {entity}')
    }
  } else {
    debug('No valid entity type found on {entity}')
  }
}

export const generalEntityDataService = function (data, viewMode = 'full') {
  if (!data) return null
  if (!Array.isArray(data)) {
    return entityDataServiceLookup(data, viewMode)
  }
  const processedData = []
  for (const index in data) {
    processedData.push(entityDataServiceLookup(data[index], viewMode))
  }
  return processedData
}
