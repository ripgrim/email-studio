import { create } from "zustand";

interface UIState {
	sidebarOpen: boolean;
	selectedFolderId: string | null;
	selectedInspirationCategory: string | null;

	setSidebarOpen: (open: boolean) => void;
	setSelectedFolder: (folderId: string | null) => void;
	setSelectedCategory: (category: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
	sidebarOpen: true,
	selectedFolderId: null,
	selectedInspirationCategory: null,

	setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
	setSelectedFolder: (selectedFolderId) => set({ selectedFolderId }),
	setSelectedCategory: (selectedInspirationCategory) =>
		set({ selectedInspirationCategory }),
}));



