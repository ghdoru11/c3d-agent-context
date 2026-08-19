import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

import {
  CONTEXT_ENTRIES,
  findContextEntry,
  searchContext
} from "./context";

const textResult = (text: string) => ({
  content: [{ type: "text" as const, text }]
});

function createServer(): McpServer {
  const server = new McpServer({
    name: "c3d-agent-context",
    version: "0.1.0"
  });

  server.registerTool(
    "list_context",
    {
      description:
        "List the sanitized Civil 3D context entries available from this read-only server."
    },
    async () =>
      textResult(
        JSON.stringify(
          CONTEXT_ENTRIES.map(({ id, title, summary, tags }) => ({
            id,
            title,
            summary,
            tags
          })),
          null,
          2
        )
      )
  );

  server.registerTool(
    "read_context",
    {
      description:
        "Read one sanitized context entry by the stable ID returned by list_context.",
      inputSchema: {
        id: z.string().min(1).max(80)
      }
    },
    async ({ id }) => {
      const entry = findContextEntry(id);

      if (!entry) {
        return {
          ...textResult(`Unknown context entry: ${id}`),
          isError: true
        };
      }

      return textResult(JSON.stringify(entry, null, 2));
    }
  );

  server.registerTool(
    "search_context",
    {
      description:
        "Search sanitized Civil 3D context by keyword. Searches IDs, titles, summaries, tags, and content.",
      inputSchema: {
        query: z.string().trim().min(2).max(120),
        limit: z.number().int().min(1).max(10).default(5)
      }
    },
    async ({ query, limit }) =>
      textResult(JSON.stringify(searchContext(query, limit), null, 2))
  );

  return server;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.json({
        name: "c3d-agent-context",
        version: "0.1.0",
        status: "ok",
        transport: "streamable-http",
        mcp_endpoint: "/mcp",
        access: "public-read-only"
      });
    }

    if (url.pathname !== "/mcp") {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return createMcpHandler(createServer)(request, env, ctx);
  }
} satisfies ExportedHandler<Env>;
