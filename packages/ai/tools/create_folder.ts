import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const createFolder = toolDefinition({
	name: "createFolder",
	description: "Create a new folder for organizing email templates",
	inputSchema: z.object({
		name: z.string().describe("Folder name"),
		parentId: z.string().optional().describe("Parent folder ID (for nested folders)"),
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

