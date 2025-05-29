/**
 * Mock data for the VAMC facility.
 */

import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import deflatedData from './healthCareLocalFacility.mock.json'
import { inflateObjectGraph } from '@/lib/utils/object-graph'

const mockData = inflateObjectGraph<NodeHealthCareLocalFacility>(deflatedData)

export default mockData
