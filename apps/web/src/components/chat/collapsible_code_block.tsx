"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface CollapsibleCodeBlockProps {
	children: React.ReactNode;
	maxHeight?: number;
}

export function CollapsibleCodeBlock({
	children,
	maxHeight = 120,
}: CollapsibleCodeBlockProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [needsCollapse, setNeedsCollapse] = useState(false);
	const contentRef = useState<HTMLDivElement | null>(null)[0];

	// Check if content needs collapsing
	const checkHeight = (element: HTMLDivElement | null) => {
		if (element) {
			const height = element.scrollHeight;
			if (height > maxHeight) {
				setNeedsCollapse(true);
			}
		}
	};

	return (
		<div className="relative">
			<div
				ref={(el) => {
					if (el) {
						checkHeight(el);
					}
				}}
				className={cn(
					"overflow-hidden transition-all duration-200",
					!isExpanded && needsCollapse && "code-block-collapsed"
				)}
				style={
					!isExpanded && needsCollapse
						? { maxHeight: `${maxHeight}px` }
						: undefined
				}
			>
				{children}
			</div>
			{needsCollapse && (
				<div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-2 pt-8 bg-gradient-to-t from-card via-card/80 to-transparent">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsExpanded(!isExpanded)}
						className="h-7 text-xs gap-1"
					>
						{isExpanded ? (
							<>
								<HugeiconsIcon icon={ArrowUp01Icon} className="h-3 w-3" />
								Show less
							</>
						) : (
							<>
								<HugeiconsIcon icon={ArrowDown01Icon} className="h-3 w-3" />
								Show more
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	);
}


