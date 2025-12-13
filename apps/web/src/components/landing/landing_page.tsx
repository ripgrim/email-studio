"use client";

import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";


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
			<div className="w-full max-w-2xl space-y-8">
				<div className="text-center space-y-4">
					<h1 className="text-3xl md:text-4xl font-semibold max-w-xl mx-auto">
						What do you want to build?
					</h1>
					<p className="text-muted-foreground max-w-lg mx-auto">
						Build emails with natural language.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<Textarea
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Create a welcome email for new subscribers..."
						className="min-h-[140px] resize-none text-base placeholder:text-muted-foreground/60"
						disabled={isCreating}
					/>
					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={!prompt.trim() || isCreating}
							className="gap-2 font-medium px-6"
							size="lg"
						>
							{isCreating ? "Creating your chat..." : "Begin Creating"}
							<HugeiconsIcon icon={SentIcon} className="size-4" />
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

