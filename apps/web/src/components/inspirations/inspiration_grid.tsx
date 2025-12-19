import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { InspirationCard } from "./inspiration_card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUIStore } from "@/stores/ui";

export function InspirationGrid() {
	const { selectedInspirationCategory } = useUIStore();

	const inspirationsQuery = useQuery(
		convexQuery(api.inspirations.list, {
			category: selectedInspirationCategory || undefined,
		}),
	);

	const inspirations = inspirationsQuery.data || [];

	if (inspirationsQuery.isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-32" />
				))}
			</div>
		);
	}

	if (inspirations.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center text-muted-foreground">
					<p className="mb-2 text-lg font-medium">No inspirations found</p>
					<p className="text-sm">
						Inspiration templates will appear here once seeded.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{inspirations.map((inspiration) => (
				<InspirationCard
					key={inspiration._id}
					slug={inspiration.slug}
					name={inspiration.name}
					description={inspiration.description}
					category={inspiration.category}
					tags={inspiration.tags}
					onClick={() => {
						// Handle click - could navigate or use in chat
						console.log("Use inspiration:", inspiration.slug);
					}}
				/>
			))}
		</div>
	);
}



