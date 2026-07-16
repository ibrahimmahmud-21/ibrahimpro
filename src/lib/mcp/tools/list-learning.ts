import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_learning",
  title: "List current learning modules",
  description: "List the topics Ibrahim is currently learning.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const modules = [
      { id: "01", title: "Cyber Security", detail: "Networks, defenses, offensive fundamentals — one lab at a time." },
      { id: "02", title: "AI", detail: "Prompting, agents, and using models as leverage for real work." },
      { id: "03", title: "Programming", detail: "Web fundamentals, scripting, and shipping small tools that solve problems." },
    ];
    return {
      content: [{ type: "text", text: JSON.stringify(modules, null, 2) }],
      structuredContent: { modules },
    };
  },
});
