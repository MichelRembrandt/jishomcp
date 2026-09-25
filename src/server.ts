import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { fetchJisho } from './jisho.js';

export function buildServer() {
    const server = new McpServer({
        name: 'task-server',
        version: '1.0.0'
    });

    server.registerTool(
        'lookup_word',
        {
            title: 'Lookup word',
            description: 'Lookup a japanese word on Jisho',
            inputSchema: {
                word: z.string().min(1).max(10).describe('Japanese word to look up, written in kanji, hiragana or katakana')
            },
            annotations: {
                readOnlyHint: true
            }
        },
        async ({ word }) => {
            const response = await fetchJisho(word);
            return {
                content: [{ type: 'text', text: JSON.stringify(response) }]
            };
        }
    );

    return server;
}

