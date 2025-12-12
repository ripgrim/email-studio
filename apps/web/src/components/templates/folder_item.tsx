import { Button } from "@/components/ui/button";
import { Folder, ChevronRight, MoreVertical } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/stores/ui";
import type { Id } from "@inbound-hackathon/backend/convex/_generated/dataModel";

interface FolderItemProps {
	id: Id<"folders">;
	name: string;
	isSelected?: boolean;
	hasChildren?: boolean;
	onClick?: () => void;
	onDelete?: () => void;
	onRename?: () => void;
}

export function FolderItem({
	id,
	name,
	isSelected = false,
	hasChildren = false,
	onClick,
	onDelete,
	onRename,
}: FolderItemProps) {
	const { setSelectedFolder } = useUIStore();

	const handleClick = () => {
		setSelectedFolder(id);
		onClick?.();
	};

	return (
		<div className="group/menu-item relative flex items-center">
			<Button
				variant="ghost"
				size="sm"
				className={`h-7 w-full justify-start rounded-md px-2.5 text-xs font-normal text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors group-data-[collapsible=icon]:justify-center ${
					isSelected ? "bg-sidebar-accent text-sidebar-foreground font-medium" : ""
				}`}
				onClick={handleClick}
			>
				<Folder className="h-3.5 w-3.5 shrink-0 mr-2 group-data-[collapsible=icon]:mr-0" />
				<span className="flex-1 text-left truncate group-data-[collapsible=icon]:hidden">{name}</span>
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-1 h-6 w-6 opacity-0 transition-opacity group-hover/menu-item:opacity-100 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden"
					>
						<MoreVertical className="h-3.5 w-3.5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
					<DropdownMenuItem onClick={onDelete} className="text-destructive">
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

