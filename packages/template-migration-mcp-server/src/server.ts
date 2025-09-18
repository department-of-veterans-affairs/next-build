import fs from 'fs'
import path from 'path'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import resourceTypes from '../data/resourceTypes.json' with { type: 'json' }
import { fetchEntity } from './fetchEntity.ts'

const __dirname = new URL('.', import.meta.url).pathname

// Create an MCP server
const server = new McpServer({
  name: 'demo-server',
  version: '1.0.0',
})

// Resource type list
server.registerTool(
  'list-resource-types',
  {
    title: 'List Resource Types',
    description: 'List all resource types',
  },
  async () => {
    return {
      content: [
        {
          type: 'text',
          text: 'Resource types: ' + JSON.stringify(resourceTypes),
        },
      ],
    }
  }
)

// This may be better off as a resource, but 🤷
server.registerTool(
  'fetch-schema',
  {
    title: 'Fetch Schema',
    description: 'Fetch the schema for a resource type',
    inputSchema: { resourceType: z.string() },
  },
  async ({ resourceType }) => {
    return {
      content: [
        {
          type: 'text',
          text: fs.readFileSync(
            path.join(__dirname, `../data/schemas/${resourceType}.json`),
            'utf8'
          ),
        },
      ],
    }
  }
)

// Register a tool to fetch an example entity of a resource type, which helps
// reveal the actual structure of relationships in the data
server.registerTool(
  'fetch-entity',
  {
    title: 'Fetch Entity',
    description:
      'Fetch an entity of a specified resource type. If no UUID is provided, fetches from a collection.',
    inputSchema: {
      resourceType: z
        .string()
        .describe(
          'The Drupal resource type (e.g., node--health_care_local_facility)'
        ),
      uuid: z
        .string()
        .optional()
        .describe('The UUID of a specific entity to fetch'),
      limit: z
        .number()
        .optional()
        .describe(
          'Number of entities to fetch when getting from collection (default: 1)'
        ),
      includes: z
        .array(z.string())
        .optional()
        .describe('Related fields to include in the response'),
    },
  },
  async ({ resourceType, uuid, limit = 1, includes = [] }) => {
    return fetchEntity({ resourceType, uuid, limit, includes })
  }
)

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport()
await server.connect(transport)
