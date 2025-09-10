import path from 'path'
import { spawn } from 'child_process'

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
  content: Array<{
    type: 'text'
    text: string
  }>
}

/**
 * Fetches an entity or collection of entities using the fetch-entity shell script.
 *
 * @param options - Configuration options for fetching entities
 * @returns Promise resolving to formatted content for MCP response
 */
export async function fetchEntity(
  options: FetchEntityOptions
): Promise<FetchEntityResult> {
  const { resourceType, uuid, limit = 1, includes = [] } = options

  try {
    // Path to the fetch-entity script
    const scriptPath = path.join(
      __dirname,
      '../../..',
      'scripts/fetch-entity/fetch-entity.sh'
    )

    // Build command args
    const args = [resourceType]
    if (uuid) {
      args.push(uuid)
    }

    let command = `${scriptPath} ${args.join(' ')}`

    // Add collection flag if no UUID is provided
    if (!uuid) {
      command += ' --collection'
      command += ` --limit ${limit}`
    }

    // Add includes if specified
    if (includes.length > 0) {
      command += ` --include ${includes.join(' ')}`
    }

    // Always request JSON output and deflate to avoid circular references
    command += ' --json --deflate'

    // Execute the command using child_process
    return new Promise((resolve, reject) => {
      const child = spawn('bash', ['-c', command])
      let stdout = ''
      let stderr = ''

      child.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      child.on('close', (code) => {
        if (code !== 0 || stderr) {
          reject(new Error(`Script failed with code ${code}: ${stderr}`))
        } else {
          resolve({
            content: [
              {
                type: 'text',
                text: stdout,
              },
            ],
          })
        }
      })

      child.on('error', (error) => {
        reject(new Error(`Failed to execute script: ${error.message}`))
      })
    })
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching entity: ${error.message}`,
        },
      ],
    }
  }
}
