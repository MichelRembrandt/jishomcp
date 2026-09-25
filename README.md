# jishomcp

A small [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that lets an MCP client such as Claude look up Japanese words on [Jisho](https://jisho.org) through its public API.

It runs over stdio and is written in TypeScript.

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

The server communicates over stdio, so it is normally launched by an MCP client rather than run by hand.

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

### Claude Code

```sh
claude mcp add jisho -- node /absolute/path/to/jishomcp/build/index.js
```

### MCP Inspector

```sh
npx @modelcontextprotocol/inspector node build/index.js
```

## Project structure

```
src/
  index.ts    # Entry point: connects the server to a stdio transport
  server.ts   # Builds the MCP server and registers the tools
  jisho.ts    # Jisho API client and response types
```

## Notes

- Data comes from the unofficial Jisho API (`https://jisho.org/api/v1/search/words`). Please be considerate with request volume.
- Logging goes to stderr, since stdout is reserved for the MCP protocol.

## License

ISC
