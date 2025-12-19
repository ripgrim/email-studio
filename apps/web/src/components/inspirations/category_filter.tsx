import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";

export function CategoryFilter() {
	const { selectedInspirationCategory, setSelectedCategory } = useUIStore();

	const inspirationsQuery = useQuery(convexQuery(api.inspirations.list, {}));
	const inspirations = inspirationsQuery.data || [];

	// Extract unique categories
	const categories = Array.from(
		new Set(inspirations.map((i) => i.category)),
	).sort();

	return (
		<div className="flex flex-wrap gap-2">
			<Button
				variant={selectedInspirationCategory === null ? "default" : "outline"}
				size="sm"
				onClick={() => setSelectedCategory(null)}
			>
				All
			</Button>
			{categories.map((category) => (
				<Button
					key={category}
					variant={
						selectedInspirationCategory === category ? "default" : "outline"
					}
					size="sm"
					onClick={() => setSelectedCategory(category)}
				>
					{category}
				</Button>
			))}
		</div>
	);
}



