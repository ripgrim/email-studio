import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "@/components/ai-elements/message";
import {
	PromptInput,
	PromptInputTextarea,
	PromptInputSubmit,
	PromptInputBody,
	PromptInputFooter,
	type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
	Task,
	TaskContent,
	TaskItem,
	TaskItemFile,
	TaskTrigger,
} from "@/components/ai-elements/task";
import { Loader } from "@/components/ai-elements/loader";
import { MentionAutocomplete } from "./mention_autocomplete";
import { FileText, Search, Code, FileCode } from "lucide-react";

type TaskItemData = {
	type: "text" | "file";
	text: string;
	file?: {
		name: string;
		icon?: "react" | "typescript" | "javascript" | "css" | "html" | "json" | "markdown";
		color?: string;
	};
};

type MessagePart = 
	| { type: "text"; text: string }
	| { type: "reasoning"; text: string; isStreaming?: boolean }
	| { type: "task"; title: string; items: TaskItemData[]; icon?: "search" | "file" | "code" };

interface ChatContainerProps {
	messages: Array<{ 
		role: "user" | "assistant"; 
		parts?: MessagePart[];
		content?: string; // Fallback for old format
	}>;
	onSend: (message: string) => void;
	isLoading?: boolean;
	suggestions?: string[];
	onSuggestionClick?: (suggestion: string) => void;
}

export function ChatContainer({
	messages,
	onSend,
	isLoading = false,
	suggestions = [],
	onSuggestionClick,
}: ChatContainerProps) {
	const handleSubmit = (message: PromptInputMessage) => {
		if (message.text?.trim()) {
			onSend(message.text.trim());
		}
	};

	return (
		<div className="flex h-full w-full flex-col border-r border-border bg-background min-w-0 overflow-hidden">
			{/* Compact Header */}
			<div className="shrink-0 border-b border-border bg-background px-4 py-2">
				<h2 className="text-sm font-medium">AI Assistant</h2>
			</div>

			{/* Chat Content */}
			<div className="flex flex-1 flex-col gap-2 overflow-hidden p-3 sm:p-4 min-h-0">
				<Conversation className="flex-1 min-h-0 overflow-hidden h-full">
					<ConversationContent className="h-full overflow-y-auto style-scrollbar">
						{messages.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center">
								<p className="mb-4 text-sm text-muted-foreground">
									Describe the email you want to create
								</p>
								{suggestions.length > 0 && (
									<div className="flex flex-wrap justify-center gap-1.5">
										{suggestions.map((suggestion, index) => (
											<button
												key={index}
												onClick={() => onSuggestionClick?.(suggestion)}
												className="rounded border border-border bg-background px-2.5 py-1 text-xs transition-colors hover:bg-accent"
											>
												{suggestion}
											</button>
										))}
									</div>
								)}
							</div>
						) : (
							<>
								{messages.map((message, index) => {
									const isLastMessage = index === messages.length - 1;
									const parts = message.parts || [
										{ type: "text" as const, text: message.content || "" }
									];
									
									return (
										<Message key={index} from={message.role}>
											<MessageContent>
												{parts.map((part, partIndex) => {
													if (part.type === "reasoning") {
														return (
															<Reasoning
																key={`${index}-${partIndex}`}
																className="w-full"
																isStreaming={
																	part.isStreaming && 
																	isLastMessage && 
																	isLoading
																}
															>
																<ReasoningTrigger />
																<ReasoningContent>{part.text}</ReasoningContent>
															</Reasoning>
														);
													}
													if (part.type === "task") {
														const getIcon = () => {
															switch (part.icon) {
																case "search":
																	return Search;
																case "file":
																	return FileText;
																case "code":
																	return Code;
																default:
																	return FileCode;
															}
														};
														const Icon = getIcon();
														return (
															<Task
																key={`${index}-${partIndex}`}
																className="w-full"
																defaultOpen={true}
															>
																<TaskTrigger
																	title={part.title}
																	className="[&>div]:cursor-default"
																>
																	<div className="flex w-full cursor-default items-center gap-2 text-sm text-muted-foreground">
																		<Icon className="size-4" />
																		<p className="text-sm">{part.title}</p>
																	</div>
																</TaskTrigger>
																<TaskContent>
																	{part.items.map((item, itemIndex) => (
																		<TaskItem key={itemIndex}>
																			{item.type === "file" && item.file ? (
																				<span className="inline-flex items-center gap-1">
																					{item.text}
																					<TaskItemFile>
																						{item.file.icon === "react" && (
																							<FileCode className="size-4" />
																						)}
																						{item.file.icon === "css" && (
																							<FileCode className="size-4" />
																						)}
																						<span>{item.file.name}</span>
																					</TaskItemFile>
																				</span>
																			) : (
																				item.text
																			)}
																		</TaskItem>
																	))}
																</TaskContent>
															</Task>
														);
													}
													return (
														<MessageResponse 
															key={`${index}-${partIndex}`}
															isAnimating={isLastMessage && isLoading}
														>
															{part.text}
														</MessageResponse>
													);
												})}
											</MessageContent>
										</Message>
									);
								})}
								{isLoading && (
									<Message from="assistant">
										<MessageContent>
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<Loader size={14} />
												<span>Thinking...</span>
											</div>
										</MessageContent>
									</Message>
								)}
							</>
						)}
					</ConversationContent>
					<ConversationScrollButton />
				</Conversation>

				{/* Suggestions */}
				{suggestions.length > 0 && messages.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{suggestions.map((suggestion, index) => (
							<button
								key={index}
								onClick={() => onSuggestionClick?.(suggestion)}
								className="rounded border border-border bg-background px-2.5 py-1 text-xs transition-colors hover:bg-accent"
							>
								{suggestion}
							</button>
						))}
					</div>
				)}

				{/* Input Area */}
				<div className="relative shrink-0">
					<MentionAutocomplete />
					<div className="rounded-lg border border-border bg-background">
						<PromptInput onSubmit={handleSubmit}>
							<PromptInputBody>
								<PromptInputTextarea 
									placeholder="Describe the email..." 
									className="min-h-[44px] resize-none border-0 bg-transparent px-3 py-2 text-sm focus-visible:ring-0"
								/>
							</PromptInputBody>
							<PromptInputFooter className="border-t border-border px-2 py-1.5">
								<PromptInputSubmit
									status={isLoading ? "submitted" : "ready"}
									disabled={isLoading}
								/>
							</PromptInputFooter>
						</PromptInput>
					</div>
				</div>
			</div>
		</div>
	);
}

