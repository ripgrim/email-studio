import { z } from "zod";

export const folderCreateSchema = z.object({
	name: z.string().min(1, "Folder name is required"),
	parentId: z.string().optional(),
});

export const folderUpdateSchema = z.object({
	id: z.string(),
	name: z.string().min(1).optional(),
	parentId: z.string().optional(),
});

export type FolderCreateInput = z.infer<typeof folderCreateSchema>;
export type FolderUpdateInput = z.infer<typeof folderUpdateSchema>;



