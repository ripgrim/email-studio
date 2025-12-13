import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";
import { useChatStore } from "@/stores/chat";

interface ChatInputProps {
	onSend: (message: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

export function ChatInput({
	onSend,
	disabled = false,
	placeholder = "Describe the email you want to create...",
}: ChatInputProps) {
	const [input, setInput] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const { setMentionQuery, setShowMentions } = useChatStore();

	const handleSubmit = () => {
		const trimmed = input.trim();
		if (trimmed && !disabled) {
			onSend(trimmed);
			setInput("");
			setShowMentions(false);
			setMentionQuery("");
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleChange = (value: string) => {
		setInput(value);
		const mentionMatch = value.match(/@(\w*)$/);
		if (mentionMatch) {
			setMentionQuery(mentionMatch[1]);
			setShowMentions(true);
		} else {
			setShowMentions(false);
			setMentionQuery("");
		}
	};

	return (
		<div className="relative flex gap-2 border-t bg-background p-4">
			<Input
				ref={inputRef}
				value={input}
				onChange={(e) => {
					const cursorPos = e.target.selectionStart || 0;
					handleChange(e.target.value);
					// Update cursor position after state update
					setTimeout(() => {
						if (inputRef.current) {
							inputRef.current.setSelectionRange(cursorPos, cursorPos);
						}
					}, 0);
				}}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				disabled={disabled}
				className="flex-1"
			/>
			<Button
				type="button"
				onClick={handleSubmit}
				disabled={!input.trim() || disabled}
				size="icon"
			>
				<HugeiconsIcon icon={SentIcon} className="size-4" />
			</Button>
		</div>
	);
}

