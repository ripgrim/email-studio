import { useState, useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/stores/editor";
import { EMAIL_GENERATION_SYSTEM_PROMPT } from "@inbound-hackathon/ai/prompts/system";
import { api } from "@inbound-hackathon/backend/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import type { Id } from "@inbound-hackathon/backend/convex/_generated/dataModel";

export function useEmailChat(chatId?: Id<"conversations">) {
	const { setCode, setPreviewHtml } = useEditorStore();
	const chatWithAI = useAction((api as any).ai.chatWithAI);
	const addMessage = useMutation(api.chats.addMessage);

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

	const [messages, setMessages] = useState<Array<{ 
		role: "user" | "assistant"; 
		parts?: MessagePart[];
		content?: string; // Fallback for old format
	}>>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [currentReasoning, setCurrentReasoning] = useState<string>("");

	// Load messages from chat if chatId is provided
	const chatData = chatId ? useQuery(api.chats.getById, { id: chatId }) : null;
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const hasTriggeredInitialResponse = useRef(false);
	const lastProcessedChatId = useRef<string | undefined>(undefined);
	
	// Helper function to extract and render code
	const extractAndRenderCode = useCallback(async (content: string) => {
		const codeMatch = content.match(/```(?:jsx|tsx|javascript|typescript)?\n([\s\S]*?)```/);
		if (codeMatch) {
			const code = codeMatch[1].trim();
			setCode(code);
			// Auto-render preview
			try {
				const { renderEmailTemplate } = await import(
					"@inbound-hackathon/email/renderer"
				);
				const { html } = await renderEmailTemplate(code);
				setPreviewHtml(html);
			} catch (error) {
				console.error("Failed to auto-render:", error);
			}
		}
	}, [setCode, setPreviewHtml]);
	
	// Reset state when chatId changes
	useEffect(() => {
		if (chatId !== lastProcessedChatId.current) {
			setMessages([]);
			setIsInitialLoad(true);
			hasTriggeredInitialResponse.current = false;
			lastProcessedChatId.current = chatId;
			// Clear code/preview when switching chats
			setCode("");
			setPreviewHtml("");
		}
	}, [chatId, setCode, setPreviewHtml]);
	
	useEffect(() => {
		if (chatData?.messages && isInitialLoad) {
			// Convert stored messages to the format expected by the UI
			const formattedMessages = chatData.messages.map((msg: { role: "user" | "assistant"; content: string }) => ({
				role: msg.role,
				parts: [{ type: "text" as const, text: msg.content }],
			}));
			setMessages(formattedMessages);
			setIsInitialLoad(false);
			
			// Extract code from assistant messages and restore preview
			// Find the most recent assistant message with code
			for (let i = chatData.messages.length - 1; i >= 0; i--) {
				const msg = chatData.messages[i];
				if (msg.role === "assistant" && msg.content) {
					extractAndRenderCode(msg.content);
					break; // Found code, stop searching
				}
			}
			
			// Check if the last message is from the user (no assistant response yet)
			// and trigger AI response automatically
			const lastMessage = chatData.messages[chatData.messages.length - 1];
			if (lastMessage?.role === "user" && !hasTriggeredInitialResponse.current) {
				hasTriggeredInitialResponse.current = true;
				// Trigger AI response for the initial message
				// Use setTimeout to avoid calling during render
				setTimeout(() => {
					handleSubmit(lastMessage.content);
				}, 100);
			}
		}
	}, [chatData, isInitialLoad, extractAndRenderCode]);

	const handleSubmit = async (message?: string) => {
		const userMessage = message || input.trim();
		if (!userMessage || isLoading) return;

		setInput("");
		setIsLoading(true);
		setError(null);

		const userMessageObj = { role: "user" as const, parts: [{ type: "text" as const, text: userMessage }] };
		
		// Check if this message already exists in the messages (to avoid duplicates)
		const messageAlreadyExists = messages.some(msg => {
			const msgText = msg.parts?.find(p => p.type === "text")?.text || msg.content || "";
			return msgText === userMessage && msg.role === "user";
		});
		
		// Only add to messages if it doesn't already exist (for initial message from DB)
		const newMessages = messageAlreadyExists ? messages : [...messages, userMessageObj];
		
		// Update messages state if we added a new message
		if (!messageAlreadyExists) {
			setMessages(newMessages);
		}
		setCurrentReasoning("");

		// Save user message immediately if chatId is provided and it's not already saved
		if (chatId && !messageAlreadyExists) {
			try {
				await addMessage({
					chatId,
					role: "user",
					content: userMessage,
				});
			} catch (err) {
				console.error("Failed to save user message to chat:", err);
				// Don't block the UI, just log the error
			}
		}

		try {
			const aiMessages = [
				{ role: "system" as const, content: EMAIL_GENERATION_SYSTEM_PROMPT },
				...newMessages.map(msg => {
					let content = "";
					if (msg.parts) {
						const textPart = msg.parts.find(p => p.type === "text");
						if (textPart && "text" in textPart) {
							content = textPart.text;
						}
					}
					if (!content && "content" in msg && typeof msg.content === "string") {
						content = msg.content;
					}
					return {
						role: msg.role,
						content: content || ""
					};
				}),
			];

			const response = await chatWithAI({
				messages: aiMessages,
				model: "llama-3.3-70b-versatile", // Groq model
			});

			// Build message parts - for now just text, but structure supports reasoning
			const parts: MessagePart[] = [];
			
			// If there's reasoning content, add it first
			if (currentReasoning) {
				parts.push({ 
					type: "reasoning", 
					text: currentReasoning,
					isStreaming: false 
				});
			}
			
			// Add the main content
			parts.push({ type: "text", text: response.content });

			const assistantMessage = { role: "assistant" as const, parts };
			setMessages([...newMessages, assistantMessage]);
			setCurrentReasoning("");

			// Save assistant message to chat if chatId is provided
			if (chatId) {
				try {
					await addMessage({
						chatId,
						role: "assistant",
						content: response.content,
					});
				} catch (err) {
					console.error("Failed to save assistant message to chat:", err);
					// Don't block the UI, just log the error
				}
			}

			// Handle code extraction
			await extractAndRenderCode(response.content);
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to get AI response");
			console.error("AI chat error:", error);
			setError(error);
			toast.error("Failed to get AI response");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (value: string) => {
		setInput(value);
	};

	return {
		messages,
		input,
		handleInputChange,
		onSend: handleSubmit,
		isLoading,
		error,
	};
}
