import { create } from "zustand";

interface ChatState {
	mentionQuery: string;
	showMentions: boolean;
	selectedMentionIndex: number;

	setMentionQuery: (query: string) => void;
	setShowMentions: (show: boolean) => void;
	selectNextMention: () => void;
	selectPrevMention: () => void;
	resetMentions: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
	mentionQuery: "",
	showMentions: false,
	selectedMentionIndex: 0,

	setMentionQuery: (mentionQuery) => set({ mentionQuery }),
	setShowMentions: (showMentions) => set({ showMentions }),
	selectNextMention: () =>
		set((s) => ({ selectedMentionIndex: s.selectedMentionIndex + 1 })),
	selectPrevMention: () =>
		set((s) => ({
			selectedMentionIndex: Math.max(0, s.selectedMentionIndex - 1),
		})),
	resetMentions: () =>
		set({ mentionQuery: "", showMentions: false, selectedMentionIndex: 0 }),
}));



