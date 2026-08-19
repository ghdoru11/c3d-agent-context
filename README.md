# c3d-agent-context

Public, read-only Model Context Protocol (MCP) server for sharing sanitized
Civil 3D agent guidance between AI clients.

The Worker distributes documentation and operating rules. It does **not**
connect to Civil 3D, execute CAD commands, or expose local project data.

## MCP endpoint

Production endpoint:

```text
https://long-fog-31d5.thoracic-colt.workers.dev/mcp
```

Available tools:

- `list_context` — list the published context entries.
- `read_context` — read one entry by its stable ID.
- `search_context` — search titles, summaries, tags, and content.

The root URL provides a small JSON health response.

## Local development

```bash
npm install
npm run types
npm run check
npm run dev
```

The local MCP endpoint is `http://localhost:8788/mcp`.

## Deployment

```bash
npm run deploy
```

`wrangler.jsonc` targets the Worker named `long-fog-31d5`. GitHub Actions
validates every push and deploys permanently when the repository secrets
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are configured.

The older `long-fog-31d5.ghdoru11.workers.dev` endpoint is a separate
placeholder Worker and is not the MCP endpoint.

## Security boundary

This repository and its deployed MCP endpoint are public. Only publish
sanitized material. Never add:

- local filesystem paths or usernames;
- drawing names, customer identifiers, or project coordinates;
- API keys, tokens, credentials, or private endpoints;
- proprietary source documents or unredacted logs.

The local Civil 3D execution bridge remains a separate component with its own
approval and rollback controls.
