import { create } from "zustand";

interface EditorState {
	currentTemplateId: string | null;
	code: string;
	previewHtml: string;
	isDirty: boolean;

	setCode: (code: string) => void;
	setPreviewHtml: (html: string) => void;
	setCurrentTemplate: (id: string | null) => void;
	markClean: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
	currentTemplateId: null,
	code: "",
	previewHtml: "",
	isDirty: false,

	setCode: (code) => set({ code, isDirty: true }),
	setPreviewHtml: (previewHtml) => set({ previewHtml }),
	setCurrentTemplate: (currentTemplateId) =>
		set({ currentTemplateId, isDirty: false }),
	markClean: () => set({ isDirty: false }),
}));


