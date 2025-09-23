import jsonApiSchema from '../data/openapi_swagger.json' with { type: 'json' }
import fs from 'fs'
import path from 'path'

const resourceTypes = Object.keys(jsonApiSchema.definitions)

for (const resourceType of resourceTypes) {
  const resource = jsonApiSchema.definitions[resourceType]
  // Write to template-migration-mcp-server/data/${resourceType}.json
  fs.writeFileSync(
    `./data/${resourceType}.json`,
    JSON.stringify(resource, null, 2)
  )
}
