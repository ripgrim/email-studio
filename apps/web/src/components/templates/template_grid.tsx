import { useQuery } from "convex/react";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { TemplateCard } from "./template_card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUIStore } from "@/stores/ui";
import { useEditorStore } from "@/stores/editor";
import { useMutation } from "convex/react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@clerk/tanstack-react-start";
import type { Id } from "@inbound-hackathon/backend/convex/_generated/dataModel";

export function TemplateGrid() {
	const { isSignedIn } = useAuth();
	const { selectedFolderId } = useUIStore();
	const { setCurrentTemplate, setCode } = useEditorStore();
	const router = useRouter();
	const deleteTemplate = useMutation(api.templates.deleteTemplate);

	const templates = useQuery(
		api.templates.list,
		isSignedIn ? { folderId: selectedFolderId as Id<"folders"> | null } : "skip"
	) || [];

	const handleTemplateClick = (templateId: Id<"templates">) => {
		setCurrentTemplate(templateId);
		router.navigate({ to: "/" });
	};

	const handleDelete = async (templateId: string) => {
		if (confirm("Are you sure you want to delete this template?")) {
			await deleteTemplate({ id: templateId as any });
		}
	};

	const isLoading = templates === undefined && isSignedIn;
	
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-32" />
				))}
			</div>
		);
	}

	if (templates.length === 0) {
		return (
			<div className="w-full flex h-full items-center justify-center">
				<div className="text-center text-muted-foreground">
					<p className="mb-2 text-lg font-medium">No templates yet</p>
					<p className="text-sm">
						Start a conversation to create your first email template.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{templates.map((template) => (
				<TemplateCard
					key={template._id}
					id={template._id}
					name={template.name}
					subject={template.subject}
					description={template.description}
					onClick={() => handleTemplateClick(template._id)}
					onEdit={() => handleTemplateClick(template._id)}
					onDelete={() => handleDelete(template._id)}
				/>
			))}
		</div>
	);
}

