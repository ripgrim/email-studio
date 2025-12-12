import { createOpenAI } from "@tanstack/ai-openai";

// Note: This adapter is not used client-side anymore (AI calls go through Convex)
// Keeping for reference but it won't be used
export const adapter = createOpenAI(process.env.GROQ_API_KEY || "", {
	baseURL: "https://api.groq.com/openai/v1",
});

