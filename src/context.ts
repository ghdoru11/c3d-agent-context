export interface ContextEntry {
  id: string;
  title: string;
  summary: string;
  tags: readonly string[];
  content: string;
}

export const CONTEXT_ENTRIES: readonly ContextEntry[] = [
  {
    id: "project-overview",
    title: "C3D Agent Context overview",
    summary: "Purpose and boundaries of the shared context service.",
    tags: ["architecture", "mcp", "civil3d"],
    content: [
      "This service distributes sanitized operating context to AI agents.",
      "It is documentation-only and cannot execute Civil 3D commands.",
      "The Windows Civil 3D bridge is a separate local component.",
      "No local paths, project identifiers, credentials, or customer data belong here."
    ].join("\n")
  },
  {
    id: "safety-contract",
    title: "Civil 3D agent safety contract",
    summary: "Mandatory guardrails for agents that interact with the local bridge.",
    tags: ["safety", "approval", "rollback"],
    content: [
      "Use an inspect -> preview -> explicitly approved apply workflow.",
      "Do not change geometry, radii, lengths, speeds, points, or design settings without explicit approval.",
      "Verify the exact target drawing and object identity before every mutation.",
      "After an approved change, verify the result and preserve a native rollback path.",
      "Do not expose generic execute, query, or command tools to agents."
    ].join("\n")
  },
  {
    id: "component-boundaries",
    title: "Component boundaries",
    summary: "Responsibility split between the public context MCP and the local Civil 3D bridge.",
    tags: ["architecture", "worker", "local-bridge"],
    content: [
      "Cloudflare Worker: publishes sanitized, read-only context over remote MCP.",
      "GitHub repository: version-controls public code and sanitized context.",
      "Local bridge: performs bounded Civil 3D inspection and approved mutations.",
      "Cloudflare Tunnel or another secure channel may expose a local service, but does not inspect the host by itself."
    ].join("\n")
  },
  {
    id: "tool-design",
    title: "Tool design rules",
    summary: "Rules for adding future MCP tools without creating an unsafe generic control surface.",
    tags: ["tools", "validation", "least-privilege"],
    content: [
      "Prefer a small number of goal-oriented tools with strict schemas.",
      "Separate read operations from state-changing operations.",
      "Validate every parameter and return structured, auditable results.",
      "Keep public context tools read-only; place privileged execution behind a separate authenticated boundary."
    ].join("\n")
  }
];

export function findContextEntry(id: string): ContextEntry | undefined {
  return CONTEXT_ENTRIES.find((entry) => entry.id === id);
}

export function searchContext(query: string, limit: number): ContextEntry[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("en-US");

  return CONTEXT_ENTRIES.filter((entry) => {
    const searchable = [
      entry.id,
      entry.title,
      entry.summary,
      entry.tags.join(" "),
      entry.content
    ]
      .join("\n")
      .toLocaleLowerCase("en-US");

    return searchable.includes(normalizedQuery);
  }).slice(0, limit);
}
