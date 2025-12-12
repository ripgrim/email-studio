import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/page_container";
import { TemplateGrid } from "@/components/templates/template_grid";

export const Route = createFileRoute("/templates")({
	component: TemplatesPage,
});

function TemplatesPage() {
	return (
		<PageContainer>
			<div className="flex h-full overflow-auto p-6">
				<TemplateGrid />
			</div>
		</PageContainer>
	);
}
