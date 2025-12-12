"use client";

import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";

export function LandingPage() {
	const [prompt, setPrompt] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const router = useRouter();
	const createChat = useMutation(api.chats.create);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim() || isCreating) return;

		setIsCreating(true);
		try {
			const chatId = await createChat({ initialMessage: prompt.trim() });
			router.navigate({ 
				to: "/chat/$chatId", 
				params: { chatId: chatId as string } 
			});
		} catch (error) {
			console.error("Failed to create chat:", error);
			toast.error("Failed to create chat. Please try again.");
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="flex h-full flex-col items-center justify-center p-4">
			<div className="w-full max-w-2xl space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold">Create Email Templates with AI</h1>
					<p className="text-muted-foreground">
						Describe the email you want to create and we'll generate it for you
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Textarea
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="e.g., Create a welcome email for new users..."
						className="min-h-[120px] resize-none text-base"
						disabled={isCreating}
					/>
					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={!prompt.trim() || isCreating}
							className="gap-2"
						>
							<Send className="h-4 w-4" />
							{isCreating ? "Creating..." : "Start Chat"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

