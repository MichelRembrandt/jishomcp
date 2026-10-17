# jishomcp

A small [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that lets an MCP client such as Claude look up Japanese words on [Jisho](https://jisho.org) through its public API.

It runs over stdio or Streamable HTTP and is written in TypeScript.

## Tools

### `lookup_word`

Looks up a Japanese word on Jisho.

| Parameter | Type   | Description                                                         |
|-----------|--------|---------------------------------------------------------------------|
| `word`    | string | Word to look up, in kanji, hiragana or katakana (1–10 characters)   |

Returns the Jisho API response as JSON text: for each entry, the slug, whether it is common, JLPT levels, Japanese forms with readings, and senses (English definitions and parts of speech).

## Requirements

- Node.js 18 or newer (uses the built-in `fetch`)
- npm

## Setup

```sh
npm install
npm run build
```

The build compiles `src/` to `build/`.

## Usage

The server supports two transports: stdio (the default, normally launched by an MCP client) and Streamable HTTP.

### Claude Desktop

Add it to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "jisho": {
      "command": "node",
      "args": ["/absolute/path/to/jishomcp/build/index.js"]
    }
  }
}
```

To fully close claude desktop on linux use:

```bash
  pkill -f -i claude
```

### Claude Code

```sh
claude mcp add jisho -- node /absolute/path/to/jishomcp/build/index.js
```

### HTTP

Start the HTTP server (no build needed, it uses `tsx`):

```sh
npm run start:http
```

It listens on `http://127.0.0.1:3000/mcp` (localhost only). Set `PORT` to change the port:

```sh
PORT=8080 npm run start:http
```

The server is stateless: each `POST /mcp` request gets its own server and transport instance. Connect a client to it, for example:

```sh
claude mcp add --transport http jisho http://127.0.0.1:3000/mcp
```

### MCP Inspector

```sh
npx @modelcontextprotocol/inspector node build/index.js
```

## Project structure

```
src/
  index.ts    # Entry point: connects the server to a stdio transport
  http.ts     # Entry point: serves the MCP server over Streamable HTTP (Express)
  server.ts   # Builds the MCP server and registers the tools
  jisho.ts    # Jisho API client and response types
```

## Notes

- Data comes from the unofficial Jisho API (`https://jisho.org/api/v1/search/words`). Please be considerate with request volume.
- Logging goes to stderr, since stdout is reserved for the MCP protocol in stdio mode.

## License

ISC
