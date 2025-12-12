import { z } from "zod";

export const templateCreateSchema = z.object({
	name: z.string().min(1, "Template name is required"),
	subject: z.string().min(1, "Subject is required"),
	code: z.string().min(1, "Template code is required"),
	description: z.string().optional(),
	folderId: z.string().optional(),
});

export const templateUpdateSchema = z.object({
	id: z.string(),
	name: z.string().min(1).optional(),
	subject: z.string().min(1).optional(),
	code: z.string().min(1).optional(),
	description: z.string().optional(),
	folderId: z.string().optional(),
	html: z.string().optional(),
});

export type TemplateCreateInput = z.infer<typeof templateCreateSchema>;
export type TemplateUpdateInput = z.infer<typeof templateUpdateSchema>;


