"use client";

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MessageIcon, MoreVerticalCircle01Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Id } from "@inbound-hackathon/backend/convex/_generated/dataModel";

export function ChatsList() {
	const location = useLocation();
	const navigate = useNavigate();
	const chats = useQuery(api.chats.list);
	const deleteChat = useMutation(api.chats.deleteChat);

	if (!chats) {
		return (
			<div className="space-y-1">
				<div className="h-7 animate-pulse rounded-md bg-sidebar-accent/30" />
				<div className="h-7 animate-pulse rounded-md bg-sidebar-accent/30" />
			</div>
		);
	}

	if (chats.length === 0) {
		return (
			<div className="px-2.5 py-2 text-xs text-sidebar-foreground/50">
				No chats yet
			</div>
		);
	}

	// Get the first user message as the title
	const getChatTitle = (chat: typeof chats[0]) => {
		const firstUserMessage = chat.messages.find((m) => m.role === "user");
		if (firstUserMessage) {
			const content = firstUserMessage.content.trim();
			// Truncate to 30 chars max
			return content.length > 30 ? content.slice(0, 30) + "..." : content;
		}
		return "New Chat";
	};

	const currentChatId = location.pathname.split("/chat/")[1]?.split("/")[0];

	const handleDelete = async (chatId: Id<"conversations">, e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		
		try {
			await deleteChat({ id: chatId });
			toast.success("Chat deleted");
			
			// If we're currently viewing this chat, navigate away
			if (currentChatId === chatId) {
				navigate({ to: "/" });
			}
		} catch (error) {
			console.error("Failed to delete chat:", error);
			toast.error("Failed to delete chat");
		}
	};

	return (
		<div className="space-y-0.5 min-w-0 w-full">
			{chats.map((chat) => {
				const chatId = chat._id as Id<"conversations">;
				const isActive = currentChatId === chatId;
				const title = getChatTitle(chat);

				return (
					<div key={chat._id} className="group/menu-item relative flex items-center">
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								"h-7 w-full !justify-start rounded-md px-2.5 text-xs font-normal text-sidebar-foreground/70 hover:!bg-sidebar-accent hover:!text-sidebar-accent-foreground hover:!font-medium transition-colors group-data-[collapsible=icon]:!justify-center min-w-0 max-w-full",
								isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
							)}
						>
							<Link to="/chat/$chatId" params={{ chatId }} className="w-full min-w-0 max-w-full flex items-center justify-start overflow-hidden">
								<HugeiconsIcon icon={MessageIcon} className="size-4 shrink-0 mr-2 group-data-[collapsible=icon]:mr-0 flex-shrink-0" />
								<span className="truncate min-w-0 group-data-[collapsible=icon]:hidden flex-1 text-left" title={title}>
									{title}
								</span>
							</Link>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-1 h-6 w-6 opacity-0 transition-opacity group-hover/menu-item:opacity-100 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden"
									onClick={(e) => e.stopPropagation()}
								>
									<HugeiconsIcon icon={MoreVerticalCircle01Icon} className="size-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem 
									onClick={(e) => handleDelete(chatId, e)} 
									className="text-destructive"
								>
									<HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			})}
		</div>
	);
}

