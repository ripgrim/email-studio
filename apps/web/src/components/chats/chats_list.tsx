"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Id } from "@inbound-hackathon/backend/convex/_generated/dataModel";

export function ChatsList() {
	const location = useLocation();
	const chats = useQuery(api.chats.list);

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

	return (
		<div className="space-y-0.5 min-w-0 w-full">
			{chats.map((chat) => {
				const chatId = chat._id as Id<"conversations">;
				const isActive = currentChatId === chatId;
				const title = getChatTitle(chat);

				return (
					<Button
						key={chat._id}
						variant="ghost"
						size="sm"
						asChild
						className={cn(
							"h-7 w-full justify-start rounded-md px-2.5 text-xs font-normal text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors group-data-[collapsible=icon]:justify-center min-w-0 max-w-full",
							isActive && "bg-sidebar-accent text-sidebar-foreground font-medium"
						)}
					>
						<Link to="/chat/$chatId" params={{ chatId }} className="w-full min-w-0 max-w-full flex items-center overflow-hidden">
							<MessageSquare className="h-3.5 w-3.5 shrink-0 mr-2 group-data-[collapsible=icon]:mr-0 flex-shrink-0" />
							<span className="truncate min-w-0 group-data-[collapsible=icon]:hidden flex-1" title={title}>
								{title}
							</span>
						</Link>
					</Button>
				);
			})}
		</div>
	);
}

