import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const renderEmailPreview = toolDefinition({
	name: "renderEmailPreview",
	description: "Render React Email code to HTML for preview",
	inputSchema: z.object({
		code: z.string().describe("React Email JSX code"),
	}),
	outputSchema: z.object({
		html: z.string(),
		plainText: z.string(),
	}),
}).server(async () => {
	// Tool calls are handled in useEmailChat hook's onToolCall callback
	// This is just a placeholder - actual implementation is client-side
	throw new Error("This tool should be handled client-side");
});

