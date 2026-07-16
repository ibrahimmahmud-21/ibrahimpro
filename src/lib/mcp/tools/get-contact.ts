import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact",
  title: "Get contact info",
  description: "Return ways to reach Ibrahim Mahmud — email and social links.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const contact = {
      email: "x.ibrahimmahmud@gmail.com",
      website: "https://ibrahimpro.lovable.app",
      contactForm: "https://ibrahimpro.lovable.app/#contact",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(contact, null, 2) }],
      structuredContent: contact,
    };
  },
});
