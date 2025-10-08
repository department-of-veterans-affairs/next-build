# Template Migration MCP Server

## How to use the MCP server

### Setup

Using [VS Code with GitHub
Copilot](https://code.visualstudio.com/docs/copilot/customization/mcp-servers),
add the following to your MCP server settings in `.vscode/mcp.json`:

```json
{
  "servers": {
    "template-migration-mcp-server": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "tsx",
        "${workspaceFolder}/packages/template-migration-mcp-server/src/server.ts"
      ],
      "envFile": "${workspaceFolder}/envs/.env.local"
    }
  }
}
```

Other MCP clients will have similar configuration, but you likely won't be able
to use the `${workspaceFolder}` variable, which is a [VS Code-specific
feature](https://code.visualstudio.com/docs/reference/variables-reference). If your tool does not support the `${workspaceFolder}` part, you may need to make this an absolute path.

### Usage

[Using Agent
mode](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_use-mcp-tools-in-agent-mode),
just start prompting, and the LLM will determine when to use the MCP server.
You'll know it's working when it asks to call a tool on the server. Try
something like:

> Let's migrate the VAMC Policies Page. What content type is it?

That should trigger a call to the `list-resource-types` tool if your MCP server
is set up correctly.
