import type { ReactNode } from "react";

interface PageContainerProps {
	children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
	return (
		<div className="flex h-screen w-full flex-col overflow-hidden min-w-0">
			{children}
		</div>
	);
}

