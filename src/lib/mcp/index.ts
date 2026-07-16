import { defineMcp } from "@lovable.dev/mcp-js";
import getProfileTool from "./tools/get-profile";
import listSkillsTool from "./tools/list-skills";
import listLearningTool from "./tools/list-learning";
import getContactTool from "./tools/get-contact";

export default defineMcp({
  name: "ibrahim-portfolio-mcp",
  title: "Ibrahim Mahmud — Portfolio",
  version: "0.1.0",
  instructions:
    "Public MCP server for Ibrahim Mahmud's portfolio. Use these tools to look up his profile, current skills, what he is learning, and how to contact him.",
  tools: [getProfileTool, listSkillsTool, listLearningTool, getContactTool],
});
