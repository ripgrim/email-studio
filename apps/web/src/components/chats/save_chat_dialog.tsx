"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Id } from "@inbound-hackathon/backend/convex/_generated/dataModel";

interface SaveChatDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	chatId: Id<"conversations">;
	currentFolderId?: Id<"folders"> | null;
}

export function SaveChatDialog({
	open,
	onOpenChange,
	chatId,
	currentFolderId,
}: SaveChatDialogProps) {
	const folders = useQuery(api.folders.list);
	const updateFolder = useMutation(api.chats.updateFolder);
	const [selectedFolderId, setSelectedFolderId] = useState<Id<"folders"> | null>(
		currentFolderId || null
	);
	const [isSaving, setIsSaving] = useState(false);

	// Sync selected folder when dialog opens or currentFolderId changes
	useEffect(() => {
		if (open) {
			setSelectedFolderId(currentFolderId || null);
		}
	}, [open, currentFolderId]);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await updateFolder({
				chatId,
				folderId: selectedFolderId,
			});
			onOpenChange(false);
			toast.success(selectedFolderId ? "Chat saved to folder" : "Chat removed from folder");
		} catch (error) {
			console.error("Failed to save chat:", error);
			toast.error("Failed to save chat");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-sm font-medium">Save Chat to Folder</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						Choose a folder to organize this chat
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-2 py-4">
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							"w-full justify-start h-8 text-xs",
							selectedFolderId === null && "bg-accent"
						)}
						onClick={() => setSelectedFolderId(null)}
					>
						<Folder className="h-3.5 w-3.5 mr-2" />
						No Folder
					</Button>
					{folders?.map((folder) => (
						<Button
							key={folder._id}
							variant="ghost"
							size="sm"
							className={cn(
								"w-full justify-start h-8 text-xs",
								selectedFolderId === folder._id && "bg-accent"
							)}
							onClick={() => setSelectedFolderId(folder._id)}
						>
							<Folder className="h-3.5 w-3.5 mr-2" />
							{folder.name}
						</Button>
					))}
					{folders && folders.length === 0 && (
						<div className="text-xs text-muted-foreground py-2 text-center">
							No folders yet. Create one from the Templates section.
						</div>
					)}
				</div>
				<div className="flex justify-end gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onOpenChange(false)}
						className="h-7 text-xs"
					>
						Cancel
					</Button>
					<Button
						size="sm"
						onClick={handleSave}
						disabled={isSaving}
						className="h-7 text-xs"
					>
						{isSaving ? "Saving..." : "Save"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

