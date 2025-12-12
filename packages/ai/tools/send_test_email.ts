import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const sendTestEmail = toolDefinition({
	name: "sendTestEmail",
	description: "Send a test email to preview the template",
	inputSchema: z.object({
		to: z.string().email().describe("Recipient email address"),
		subject: z.string().describe("Email subject"),
		html: z.string().describe("Rendered HTML content"),
	}),
	outputSchema: z.object({
		sent: z.boolean(),
		messageId: z.string().optional(),
	}),
}).server(async () => {
	// Tool calls are handled in useEmailChat hook's onToolCall callback
	// This is just a placeholder - actual implementation is client-side
	throw new Error("This tool should be handled client-side");
});

