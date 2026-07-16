import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description: "Return Ibrahim Mahmud's public profile: name, stage, discipline, and contact email.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const profile = {
      name: "Ibrahim Mahmud",
      stage: "Class 10 Student — SSC 2027 Candidate",
      discipline: "Cybersecurity Enthusiast",
      email: "x.ibrahimmahmud@gmail.com",
      status: "Active — revisions ongoing",
      method:
        "Learn by taking things apart — networks, code, and the odd puzzle — then rebuild them correctly",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: profile,
    };
  },
});
