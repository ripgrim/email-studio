import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const saveEmailTemplate = toolDefinition({
	name: "saveEmailTemplate",
	description: "Save the generated email template to the database",
	inputSchema: z.object({
		name: z.string().describe("Template name"),
		subject: z.string().describe("Email subject line"),
		code: z.string().describe("React Email JSX code"),
		folderId: z.string().optional().describe("Folder ID to save in (optional)"),
		description: z.string().optional().describe("Template description"),
	}),
	outputSchema: z.object({
		id: z.string(),
		success: z.boolean(),
	}),
}).server(async () => {
	// Tool calls are handled in useEmailChat hook's onToolCall callback
	// This is just a placeholder - actual implementation is client-side
	throw new Error("This tool should be handled client-side");
});

