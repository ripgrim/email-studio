import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/page_container";
import { InspirationGrid } from "@/components/inspirations/inspiration_grid";
import { CategoryFilter } from "@/components/inspirations/category_filter";

export const Route = createFileRoute("/inspirations")({
	component: InspirationsPage,
});

function InspirationsPage() {
	return (
		<PageContainer>
			<div className="flex h-full overflow-auto p-6">
				<div className="w-full">
					<div className="mb-6">
						<h1 className="mb-4 text-2xl font-bold">Inspiration Gallery</h1>
						<CategoryFilter />
					</div>
					<InspirationGrid />
				</div>
			</div>
		</PageContainer>
	);
}
