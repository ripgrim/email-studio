import { action } from "./_generated/server";
import { v } from "convex/values";
import { Inbound } from "inboundemail";

const inbound = new Inbound({ apiKey: process.env.INBOUND_API_KEY! });

export const sendEmail = action({
	args: {
		to: v.string(),
		subject: v.string(),
		html: v.string(),
		from: v.optional(v.string()),
	},
	handler: async (ctx, { to, subject, html, from }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		// Use the from address from env or args, or throw a helpful error
		const fromAddress = from || process.env.INBOUND_FROM_EMAIL;
		if (!fromAddress) {
			throw new Error(
				"From address not configured. Please set INBOUND_FROM_EMAIL in your Convex dashboard or provide a 'from' parameter."
			);
		}

		try {
			const result = await inbound.emails.send({
				from: fromAddress,
				to,
				subject,
				html,
			});
			return { messageId: result.id, sent: true };
		} catch (error: any) {
			// Provide a more helpful error message
			if (error?.message?.includes("permission")) {
				throw new Error(
					`Email sending failed: ${error.message}. Please verify your domain in the Inbound dashboard or use a verified email address.`
				);
			}
			throw error;
		}
	},
});

export const replyToEmail = action({
	args: {
		inReplyTo: v.string(),
		to: v.string(),
		subject: v.string(),
		html: v.string(),
		from: v.optional(v.string()),
	},
	handler: async (ctx, { inReplyTo, to, subject, html, from }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const result = await inbound.emails.reply(inReplyTo, {
			from: from || "noreply@yourdomain.com",
			to,
			subject,
			html,
		});
		return { messageId: result.id, sent: true };
	},
});

