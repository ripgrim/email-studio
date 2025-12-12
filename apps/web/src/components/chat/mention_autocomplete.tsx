import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useChatStore } from "@/stores/chat";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";

export function MentionAutocomplete() {
	const {
		mentionQuery,
		showMentions,
		selectedMentionIndex,
		setShowMentions,
		resetMentions,
	} = useChatStore();

	const inspirationsQuery = useQuery(
		convexQuery(api.inspirations.search, {
			query: mentionQuery || "",
		}),
	);

	const inspirations = inspirationsQuery.data || [];

	useEffect(() => {
		if (!showMentions) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				resetMentions();
			}
		};

		window.addEventListener("keydown", handleKeyDown as any);
		return () => window.removeEventListener("keydown", handleKeyDown as any);
	}, [showMentions, resetMentions]);

	if (!showMentions || !mentionQuery) return null;

	return (
		<div className="absolute bottom-full left-4 right-4 mb-2 z-50">
			<Card>
				<CardContent className="p-2">
					<div className="max-h-48 overflow-y-auto">
						{inspirations.length === 0 ? (
							<div className="px-2 py-1 text-sm text-muted-foreground">
								No inspirations found
							</div>
						) : (
							inspirations.map((inspiration, index) => (
								<div
									key={inspiration.slug}
									className={`cursor-pointer rounded px-2 py-1 text-sm ${
										index === selectedMentionIndex
											? "bg-accent"
											: "hover:bg-accent/50"
									}`}
									onClick={() => {
										// Handle selection - this will be wired up to chat input
										setShowMentions(false);
									}}
								>
									<span className="font-medium">@{inspiration.slug}</span>
									<span className="text-muted-foreground ml-2">
										{inspiration.name}
									</span>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


