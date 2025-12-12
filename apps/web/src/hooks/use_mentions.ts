import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";

export function useMentions() {
	const [mentionQuery, setMentionQuery] = useState("");
	const [showMentions, setShowMentions] = useState(false);

	const inspirationsQuery = useQuery(
		convexQuery(api.inspirations.search, {
			query: mentionQuery || "",
		}),
		{
			enabled: showMentions && mentionQuery.length > 0,
		},
	);

	const inspirations = inspirationsQuery.data || [];

	const handleMentionInput = useCallback((text: string, cursorPosition: number) => {
		const beforeCursor = text.slice(0, cursorPosition);
		const mentionMatch = beforeCursor.match(/@(\w*)$/);

		if (mentionMatch) {
			setMentionQuery(mentionMatch[1]);
			setShowMentions(true);
			return true;
		} else {
			setShowMentions(false);
			setMentionQuery("");
			return false;
		}
	}, []);

	const insertMention = useCallback(
		(text: string, cursorPosition: number, slug: string) => {
			const beforeCursor = text.slice(0, cursorPosition);
			const afterCursor = text.slice(cursorPosition);
			const mentionMatch = beforeCursor.match(/@(\w*)$/);

			if (mentionMatch) {
				const newText =
					beforeCursor.slice(0, mentionMatch.index) +
					`@${slug} ` +
					afterCursor;
				const newCursorPosition =
					(mentionMatch.index || 0) + slug.length + 2;
				return { text: newText, cursorPosition: newCursorPosition };
			}

			return { text, cursorPosition };
		},
		[],
	);

	return {
		mentionQuery,
		showMentions,
		inspirations,
		setShowMentions,
		handleMentionInput,
		insertMention,
	};
}


