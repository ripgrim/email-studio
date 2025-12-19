import { z } from "zod";

export const emailSendSchema = z.object({
	to: z.string().email("Invalid email address"),
	subject: z.string().min(1, "Subject is required"),
	html: z.string().min(1, "HTML content is required"),
	from: z.string().email().optional(),
});

export const emailReplySchema = z.object({
	inReplyTo: z.string().min(1, "Reply-to message ID is required"),
	to: z.string().email("Invalid email address"),
	subject: z.string().min(1, "Subject is required"),
	html: z.string().min(1, "HTML content is required"),
});

export type EmailSendInput = z.infer<typeof emailSendSchema>;
export type EmailReplyInput = z.infer<typeof emailReplySchema>;



