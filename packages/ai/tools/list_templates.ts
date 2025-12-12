import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const listUserTemplates = toolDefinition({
	name: "listUserTemplates",
	description: "List the user's saved email templates",
	inputSchema: z.object({
		folderId: z.string().optional().describe("Filter by folder ID"),
	}),
	outputSchema: z.object({
		templates: z.array(
			z.object({
				id: z.string(),
				name: z.string(),
				subject: z.string(),
				description: z.string().optional(),
			}),
		),
	}),
}).server(async () => {
	// Tool calls are handled in useEmailChat hook's onToolCall callback
	// This is just a placeholder - actual implementation is client-side
	throw new Error("This tool should be handled client-side");
});

