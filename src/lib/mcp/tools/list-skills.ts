import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_skills",
  title: "List core skills",
  description: "List Ibrahim's core skills with proficiency level and approximate progress percentage.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const skills = [
      { name: "Cyber Security", level: "Learning", progress: 25 },
      { name: "AI Productivity", level: "Advanced", progress: 80 },
      { name: "Vibe Coding", level: "Intermediate", progress: 60 },
      { name: "Security Tools", level: "Hands-on", progress: 55 },
    ];
    return {
      content: [{ type: "text", text: JSON.stringify(skills, null, 2) }],
      structuredContent: { skills },
    };
  },
});
