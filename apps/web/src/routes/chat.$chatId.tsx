import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@/components/layout/page_container";
import { ChatContainer } from "@/components/chat/chat_container";
import { EmailPreview } from "@/components/editor/email_preview";
import { Toolbar } from "@/components/editor/toolbar";
import { SaveChatDialog } from "@/components/chats/save_chat_dialog";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEmailChat } from "@/hooks/use_email_chat";
import { useEditorStore } from "@/stores/editor";
import { useAction, useQuery } from "convex/react";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "@inbound-hackathon/backend/convex/_generated/dataModel";

export const Route = createFileRoute("/chat/$chatId")({
	component: ChatPage,
	beforeLoad: async ({ context }) => {
		// If not authenticated, redirect to login
		const { userId } = context as { userId: string | null };
		if (!userId) {
			throw redirect({ to: "/login" });
		}
	},
});

function ChatPage() {
	const { chatId } = Route.useParams();
	const { code } = useEditorStore();
	const sendEmailAction = useAction(api.email.sendEmail);
	const chat = useEmailChat(chatId as Id<"conversations">);
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);

	// Load chat data
	const chatData = useQuery(api.chats.getById, { id: chatId as Id<"conversations"> });

	const handleSave = () => {
		setSaveDialogOpen(true);
	};

	const handleSendTest = async () => {
		if (!code) {
			toast.error("No template to send");
			return;
		}
		const email = prompt("Enter email address:");
		if (!email) return;

		try {
			const { renderEmailTemplate } = await import(
				"@inbound-hackathon/email/renderer"
			);
			const { html } = await renderEmailTemplate(code);
			await sendEmailAction({
				to: email,
				subject: "Test Email",
				html,
			});
			toast.success("Test email sent!");
		} catch (error) {
			console.error("Failed to send test email:", error);
			const errorMessage = error instanceof Error ? error.message : "Failed to send test email";
			toast.error(errorMessage, {
				description: "Make sure you have configured a verified domain in Inbound and set INBOUND_FROM_EMAIL in your Convex dashboard.",
			});
		}
	};

	const suggestions = [
		"Create a welcome email",
		"Design a newsletter template",
		"Make a promotional email",
	];

	return (
		<PageContainer>
			<div className="flex h-screen w-full flex-col overflow-hidden">
				<Toolbar
					onSave={handleSave}
					onSendTest={handleSendTest}
				/>
				<div className="flex flex-1 min-h-0 w-full min-w-0 overflow-hidden">
					{/* Desktop: Resizable horizontal layout */}
					<div className="hidden sm:flex h-full w-full min-w-0">
						<ResizablePanelGroup direction="horizontal" className="h-full w-full">
							<ResizablePanel defaultSize={50} minSize={30} className="min-w-0 h-full">
								<ChatContainer {...chat} suggestions={suggestions} />
							</ResizablePanel>
							<ResizableHandle withHandle />
							<ResizablePanel defaultSize={50} minSize={30} className="min-w-0 h-full">
								<EmailPreview />
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
					{/* Mobile: Stack vertically */}
					<div className="flex sm:hidden h-full w-full flex-col overflow-hidden">
						<div className="flex-1 min-h-0 min-w-0 border-b border-border overflow-hidden">
							<ChatContainer {...chat} suggestions={suggestions} />
						</div>
						<div className="flex-1 min-h-0 min-w-0 overflow-hidden">
							<EmailPreview />
						</div>
					</div>
				</div>
			</div>
			<SaveChatDialog
				open={saveDialogOpen}
				onOpenChange={setSaveDialogOpen}
				chatId={chatId as Id<"conversations">}
				currentFolderId={chatData?.folderId}
			/>
		</PageContainer>
	);
}
