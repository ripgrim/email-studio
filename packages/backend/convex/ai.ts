import { action } from "./_generated/server";
import { v } from "convex/values";
import { createOpenAI } from "@tanstack/ai-openai";
import { chat } from "@tanstack/ai";

// Use Groq's OpenAI-compatible API
const adapter = createOpenAI(process.env.GROQ_API_KEY!, {
	baseURL: "https://api.groq.com/openai/v1",
});

export const chatWithAI = action({
	args: {
		messages: v.array(
			v.object({
				role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
				content: v.string(),
			}),
		),
		model: v.optional(v.string()),
	},
	handler: async (ctx, { messages, model = "llama-3.3-70b-versatile" }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const response = await chat({
			adapter,
			model: model as any, // Groq models: llama-3.3-70b-versatile, mixtral-8x7b-32768, etc.
			messages: messages as any,
		});

		// Collect the async iterable response
		// Groq sends cumulative chunks (each chunk contains all text so far)
		// So we just take the last chunk's content
		let finalContent = "";
		
		for await (const chunk of response) {
			if (chunk.type === "content") {
				// Each chunk contains the full accumulated text, so just overwrite
				finalContent = chunk.content;
			}
		}

		return {
			content: finalContent.trim(),
			role: "assistant" as const,
		};
	},
});

