import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const getInspirationTemplate = toolDefinition({
	name: "getInspirationTemplate",
	description: "Fetch an inspiration template by slug for reference",
	inputSchema: z.object({
		slug: z.string().describe('Template slug (e.g., "welcome-modern")'),
	}),
	outputSchema: z.object({
		name: z.string(),
		code: z.string(),
		description: z.string().optional(),
	}),
}).server(async () => {
	// Tool calls are handled in useEmailChat hook's onToolCall callback
	// This is just a placeholder - actual implementation is client-side
	throw new Error("This tool should be handled client-side");
});

