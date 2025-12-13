import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
	args: {
		initialMessage: v.string(),
	},
	handler: async (ctx, { initialMessage }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const chatId = await ctx.db.insert("conversations", {
			userId: identity.subject,
			messages: [
				{
					role: "user",
					content: initialMessage,
					createdAt: Date.now(),
				},
			],
			createdAt: Date.now(),
		});

		return chatId;
	},
});

export const getById = query({
	args: { id: v.id("conversations") },
	handler: async (ctx, { id }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const chat = await ctx.db.get(id);
		if (!chat) return null;
		if (chat.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}
		return chat;
	},
});

export const addMessage = mutation({
	args: {
		chatId: v.id("conversations"),
		role: v.union(v.literal("user"), v.literal("assistant")),
		content: v.string(),
	},
	handler: async (ctx, { chatId, role, content }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const chat = await ctx.db.get(chatId);
		if (!chat) throw new Error("Chat not found");
		if (chat.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(chatId, {
			messages: [
				...chat.messages,
				{
					role,
					content,
					createdAt: Date.now(),
				},
			],
		});

		return { success: true };
	},
});

export const list = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		return ctx.db
			.query("conversations")
			.withIndex("by_user", (q) => q.eq("userId", identity.subject))
			.order("desc")
			.collect();
	},
});

export const updateFolder = mutation({
	args: {
		chatId: v.id("conversations"),
		folderId: v.union(v.id("folders"), v.null()),
	},
	handler: async (ctx, { chatId, folderId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const chat = await ctx.db.get(chatId);
		if (!chat) throw new Error("Chat not found");
		if (chat.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(chatId, {
			folderId: folderId ?? undefined,
		});

		return { success: true };
	},
});

export const deleteChat = mutation({
	args: { id: v.id("conversations") },
	handler: async (ctx, { id }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const chat = await ctx.db.get(id);
		if (!chat) throw new Error("Chat not found");
		if (chat.userId !== identity.subject) {
			throw new Error("Unauthorized");
		}

		await ctx.db.delete(id);
		return { success: true };
	},
});

