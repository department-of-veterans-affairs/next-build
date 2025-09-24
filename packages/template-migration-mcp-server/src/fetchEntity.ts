import { fetchEntity as fetchEntityScript } from '../../../scripts/fetch-entity/src/fetchEntity.ts'

export interface FetchEntityOptions {
  /**
   * Resource type to fetch.
   */
  resourceType: string
  /**
   * UUID of the entity to fetch. If no UUID is provided, a collection of
   * entities will be fetched.
   */
  uuid?: string
  /**
   * Number of entities to fetch if no UUID is provided. Defaults to 1.
   */
  limit?: number
  /**
   * Array of additional fields to include in the response. Defaults to an empty array.
   */
  includes?: string[]
}

export interface FetchEntityResult {
  [x: string]: unknown
  content: Array<{
    type: 'text'
    text: string
  }>
}

/**
 * Fetches an entity or collection of entities using the fetchEntityScript function.
 *
 * @param options - Configuration options for fetching entities
 * @returns Promise resolving to formatted content for MCP response
 */
export async function fetchEntity({
  resourceType,
  uuid,
  limit = 1,
  includes = [],
}: FetchEntityOptions): Promise<FetchEntityResult> {
  try {
    // Call the fetchEntityScript function directly
    const data = await fetchEntityScript(resourceType, uuid, {
      include: includes,
      deflate: true, // Always deflate to avoid circular references
      collection: !uuid, // Use collection mode if no UUID is provided
      limit: limit.toString(),
    })

    // Format the response as JSON string for MCP
    const jsonString = JSON.stringify(data, null, 2)

    return {
      content: [
        {
          type: 'text',
          text: jsonString,
        },
      ],
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching entity: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    }
  }
}
