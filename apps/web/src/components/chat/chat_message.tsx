import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ChatMessageProps {
	role: "user" | "assistant";
	content: string | ReactNode;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
	return (
		<div
			className={`flex w-full ${
				role === "user" ? "justify-end" : "justify-start"
			}`}
		>
			<Card
				className={`max-w-[80%] ${
					role === "user"
						? "bg-primary text-primary-foreground"
						: "bg-muted"
				}`}
			>
				<CardContent className="p-3">
					<div className="text-sm">{content}</div>
				</CardContent>
			</Card>
		</div>
	);
}

