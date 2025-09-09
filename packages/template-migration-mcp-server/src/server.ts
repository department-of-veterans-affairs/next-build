import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

// Create an MCP server
const server = new McpServer({
  name: 'demo-server',
  version: '1.0.0',
})

// Add an addition tool
server.registerTool(
  'add',
  {
    title: 'Addition Tool',
    description: 'Add two numbers',
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => {
    return {
      content: [{ type: 'text', text: String(a + b) }],
    }
  }
)

// Add a subtraction tool
server.registerTool(
  'subtract',
  {
    title: 'Subtraction Tool',
    description: 'Subtract two numbers',
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a - b) }],
  })
)

// Add a multiplication tool
server.registerTool(
  'multiply',
  {
    title: 'Multiplication Tool',
    description: 'Multiply two numbers',
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a * b) }],
  })
)

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
