/**
 * Mock data for the VAMC facility. Import from this rather than the JSON file
 * to inflate the object graph automatically. The data has circular references,
 * so it needs deflation for serialization and inflation for use.
 */

import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import deflatedData from './mock.json'
import { inflateObjectGraph } from '@/lib/utils/object-graph'

const mockData = inflateObjectGraph<NodeHealthCareLocalFacility>(deflatedData)

export default mockData
