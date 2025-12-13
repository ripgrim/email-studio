import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreVerticalCircle01Icon, Delete01Icon, Edit01Icon } from "@hugeicons/core-free-icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Id } from "@inbound-hackathon/backend/convex/_generated/dataModel";

interface TemplateCardProps {
	id: Id<"templates">;
	name: string;
	subject: string;
	description?: string;
	onClick?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
}

export function TemplateCard({
	id,
	name,
	subject,
	description,
	onClick,
	onEdit,
	onDelete,
}: TemplateCardProps) {
	return (
		<Card
			className="cursor-pointer transition-shadow hover:shadow-md"
			onClick={onClick}
		>
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				<div className="flex-1">
					<CardTitle className="text-base">{name}</CardTitle>
					<p className="text-muted-foreground mt-1 text-sm">{subject}</p>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => e.stopPropagation()}
						>
							<HugeiconsIcon icon={MoreVerticalCircle01Icon} className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={(e) => {
							e.stopPropagation();
							onEdit?.();
						}}>
							<HugeiconsIcon icon={Edit01Icon} className="mr-2 size-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								onDelete?.();
							}}
							className="text-destructive"
						>
							<HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			{description && (
				<CardContent>
					<p className="text-muted-foreground text-sm line-clamp-2">
						{description}
					</p>
				</CardContent>
			)}
		</Card>
	);
}


