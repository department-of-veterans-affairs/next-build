import fs from 'fs'
import path from 'path'
import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import resourceTypes from '../data/resourceTypes.json' with { type: 'json' }

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

// TODO: Register a tool to fetch an example entity of a resource type, which is
// the only way we can see what resource type the relationships are

// Add a dynamic greeting resource
server.registerResource(
  'greeting',
  new ResourceTemplate('greeting://{name}', { list: undefined }),
  {
    title: 'Greeting Resource', // Display name for UI
    description: 'Dynamic greeting generator',
  },
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
)

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport()
await server.connect(transport)
