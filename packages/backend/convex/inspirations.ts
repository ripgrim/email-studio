import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		return await ctx.db
			.query("inspirations")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.first();
	},
});

export const list = query({
	args: { category: v.optional(v.string()) },
	handler: async (ctx, { category }) => {
		if (category) {
			return await ctx.db
				.query("inspirations")
				.withIndex("by_category", (q) => q.eq("category", category))
				.collect();
		}
		return await ctx.db.query("inspirations").collect();
	},
});

export const search = query({
	args: { query: v.string() },
	handler: async (ctx, { query: searchQuery }) => {
		return await ctx.db
			.query("inspirations")
			.withSearchIndex("search_name", (q) => q.search("name", searchQuery))
			.collect();
	},
});


