import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		return ctx.db
			.query("folders")
			.withIndex("by_user", (q) => q.eq("userId", identity.subject))
			.collect();
	},
});

export const getById = query({
	args: { id: v.id("folders") },
	handler: async (ctx, { id }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const folder = await ctx.db.get(id);
		if (!folder) return null;
		if (folder.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}
		return folder;
	},
});

export const create = mutation({
	args: {
		name: v.string(),
		parentId: v.optional(v.id("folders")),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		return ctx.db.insert("folders", {
			...args,
			userId: identity.subject,
			createdAt: Date.now(),
		});
	},
});

export const update = mutation({
	args: {
		id: v.id("folders"),
		name: v.optional(v.string()),
		parentId: v.optional(v.id("folders")),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const { id, ...updates } = args;
		const folder = await ctx.db.get(id);
		if (!folder) throw new Error("Folder not found");
		if (folder.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(id, updates);
		return { success: true };
	},
});

export const deleteFolder = mutation({
	args: { id: v.id("folders") },
	handler: async (ctx, { id }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const folder = await ctx.db.get(id);
		if (!folder) throw new Error("Folder not found");
		if (folder.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}

		// Check if folder has children
		const children = await ctx.db
			.query("folders")
			.withIndex("by_parent", (q) => q.eq("parentId", id))
			.collect();

		if (children.length > 0) {
			throw new Error("Cannot delete folder with subfolders");
		}

		// Check if folder has templates
		const templates = await ctx.db
			.query("templates")
			.withIndex("by_folder", (q) => q.eq("folderId", id))
			.collect();

		if (templates.length > 0) {
			throw new Error("Cannot delete folder with templates");
		}

		await ctx.db.delete(id);
		return { success: true };
	},
});


