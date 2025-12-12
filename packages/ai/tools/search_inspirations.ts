import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const searchInspirations = toolDefinition({
	name: "searchInspirations",
	description: "Search the inspiration gallery for templates",
	inputSchema: z.object({
		query: z.string().describe("Search query"),
		category: z.string().optional().describe("Filter by category"),
	}),
	outputSchema: z.object({
		inspirations: z.array(
			z.object({
				slug: z.string(),
				name: z.string(),
				description: z.string().optional(),
				category: z.string(),
			}),
		),
	}),
}).server(async () => {
	// Tool calls are handled in useEmailChat hook's onToolCall callback
	// This is just a placeholder - actual implementation is client-side
	throw new Error("This tool should be handled client-side");
});

