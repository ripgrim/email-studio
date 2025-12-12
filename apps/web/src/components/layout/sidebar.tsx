import type { ReactNode } from "react";
import { useUIStore } from "@/stores/ui";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";

interface SidebarProps {
	children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
	const { sidebarOpen, setSidebarOpen } = useUIStore();

	return (
		<>
			{sidebarOpen && (
				<aside className="flex h-full w-64 flex-col border-r bg-background">
					<div className="flex items-center justify-between border-b p-4">
						<h2 className="font-semibold">Navigation</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setSidebarOpen(false)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex-1 overflow-y-auto p-4">{children}</div>
				</aside>
			)}
			{!sidebarOpen && (
				<Button
					variant="ghost"
					size="icon"
					className="fixed left-4 top-4 z-50"
					onClick={() => setSidebarOpen(true)}
				>
					<Menu className="h-4 w-4" />
				</Button>
			)}
		</>
	);
}

