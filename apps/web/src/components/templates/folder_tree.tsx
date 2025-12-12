import { useQuery } from "convex/react";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { FolderItem } from "./folder_item";
import { Button } from "@/components/ui/button";
import { Plus, Folder } from "lucide-react";
import { useUIStore } from "@/stores/ui";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/tanstack-react-start";

export function FolderTree() {
	const { isSignedIn } = useAuth();
	const { selectedFolderId, setSelectedFolder } = useUIStore();
	const [isCreating, setIsCreating] = useState(false);
	const [newFolderName, setNewFolderName] = useState("");
	const createFolder = useMutation(api.folders.create);

	const folders = useQuery(api.folders.list, isSignedIn ? {} : "skip") || [];

	const handleCreateFolder = async () => {
		if (!newFolderName.trim()) return;
		await createFolder({ name: newFolderName.trim() });
		setNewFolderName("");
		setIsCreating(false);
	};

	const handleDeleteFolder = async (folderId: string) => {
		// Will be implemented with delete mutation
		console.log("Delete folder:", folderId);
	};

	return (
		<div className="space-y-1">
			{isCreating && (
				<div className="px-1.5 mb-1">
					<Input
						value={newFolderName}
						onChange={(e) => setNewFolderName(e.target.value)}
						placeholder="Folder name"
						className="h-7 text-xs"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleCreateFolder();
							}
							if (e.key === "Escape") {
								setIsCreating(false);
								setNewFolderName("");
							}
						}}
						autoFocus
					/>
				</div>
			)}

			<Button
				variant="ghost"
				size="sm"
				className={`h-7 w-full justify-start rounded-md px-2.5 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors ${
					selectedFolderId === null ? "bg-sidebar-accent text-sidebar-foreground font-medium" : ""
				} group-data-[collapsible=icon]:justify-center`}
				onClick={() => setSelectedFolder(null)}
			>
				<Folder className="h-3.5 w-3.5 shrink-0 mr-2 group-data-[collapsible=icon]:mr-0" />
				<span className="group-data-[collapsible=icon]:hidden">All Templates</span>
			</Button>

			{folders.map((folder) => (
				<FolderItem
					key={folder._id}
					id={folder._id}
					name={folder.name}
					isSelected={selectedFolderId === folder._id}
					onDelete={() => handleDeleteFolder(folder._id)}
				/>
			))}
			
			{!isCreating && (
				<Button
					variant="ghost"
					size="sm"
					className="h-7 w-full justify-start rounded-md px-2.5 text-xs text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground/70 transition-colors group-data-[collapsible=icon]:justify-center"
					onClick={() => setIsCreating(true)}
				>
					<Plus className="h-3.5 w-3.5 shrink-0 mr-2 group-data-[collapsible=icon]:mr-0" />
					<span className="group-data-[collapsible=icon]:hidden">New Folder</span>
				</Button>
			)}
		</div>
	);
}

