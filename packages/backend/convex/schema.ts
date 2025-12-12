import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
	// Folders for organizing templates
	folders: defineTable({
		name: v.string(),
		parentId: v.optional(v.id("folders")),
		userId: v.string(), // Clerk user ID
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_parent", ["parentId"]),

	// Email templates
	templates: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		subject: v.string(),
		code: v.string(), // React Email JSX
		html: v.optional(v.string()), // Cached rendered HTML
		folderId: v.optional(v.id("folders")),
		userId: v.string(),
		thumbnail: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_folder", ["folderId"])
		.searchIndex("search_name", { searchField: "name" }),

	// Inspiration gallery
	inspirations: defineTable({
		slug: v.string(), // For @mentions
		name: v.string(),
		description: v.optional(v.string()),
		code: v.string(),
		category: v.string(),
		tags: v.array(v.string()),
	})
		.index("by_slug", ["slug"])
		.index("by_category", ["category"])
		.searchIndex("search_name", { searchField: "name" }),

	// Chat history (optional)
	conversations: defineTable({
		userId: v.string(),
		messages: v.array(
			v.object({
				role: v.union(v.literal("user"), v.literal("assistant")),
				content: v.string(),
				createdAt: v.number(),
			}),
		),
		folderId: v.optional(v.id("folders")),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_folder", ["folderId"]),
});
