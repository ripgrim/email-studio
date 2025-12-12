import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
	args: { folderId: v.union(v.id("folders"), v.null()) },
	handler: async (ctx, { folderId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		// Convert null to undefined for query filtering
		const actualFolderId = folderId === null ? undefined : folderId;

		return ctx.db
			.query("templates")
			.withIndex("by_user", (q) => q.eq("userId", identity.subject))
			.filter((q) =>
				actualFolderId
					? q.eq(q.field("folderId"), actualFolderId)
					: q.eq(q.field("folderId"), undefined),
			)
			.collect();
	},
});

export const getById = query({
	args: { id: v.id("templates") },
	handler: async (ctx, { id }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const template = await ctx.db.get(id);
		if (!template) return null;
		if (template.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}
		return template;
	},
});

export const create = mutation({
	args: {
		name: v.string(),
		subject: v.string(),
		code: v.string(),
		description: v.optional(v.string()),
		folderId: v.optional(v.id("folders")),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		return ctx.db.insert("templates", {
			...args,
			userId: identity.subject,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
	},
});

export const update = mutation({
	args: {
		id: v.id("templates"),
		name: v.optional(v.string()),
		subject: v.optional(v.string()),
		code: v.optional(v.string()),
		description: v.optional(v.string()),
		folderId: v.optional(v.id("folders")),
		html: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const { id, ...updates } = args;
		const template = await ctx.db.get(id);
		if (!template) throw new Error("Template not found");
		if (template.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(id, {
			...updates,
			updatedAt: Date.now(),
		});
		return { success: true };
	},
});

export const deleteTemplate = mutation({
	args: { id: v.id("templates") },
	handler: async (ctx, { id }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const template = await ctx.db.get(id);
		if (!template) throw new Error("Template not found");
		if (template.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}

		await ctx.db.delete(id);
		return { success: true };
	},
});

