"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CollapsibleCodeWrapperProps {
	children: React.ReactNode;
	className?: string;
}

export function CollapsibleCodeWrapper({
	children,
	className,
}: CollapsibleCodeWrapperProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		
		const processCodeBlocks = () => {
			// Find all pre elements and make them collapsible
			const preElements = containerRef.current?.querySelectorAll("pre");
			if (!preElements) return;

			preElements.forEach((pre) => {
				// Skip if already processed
				if ((pre as HTMLElement).dataset.processed === "true") {
					return;
				}

				const preElement = pre as HTMLElement;
				const height = preElement.scrollHeight;
				const maxHeight = 120; // pixels

				// Always collapse if taller than maxHeight (start collapsed)
				if (height > maxHeight) {
					preElement.dataset.processed = "true";
					preElement.dataset.expanded = "false"; // Start collapsed
					preElement.classList.add("code-block-collapsible");
					preElement.style.maxHeight = `${maxHeight}px`;
					preElement.style.overflow = "hidden";
					preElement.style.position = "relative";

					// Create show more button
					const button = document.createElement("button");
					button.className = "code-block-toggle absolute bottom-2 left-1/2 -translate-x-1/2 z-10 h-7 rounded border border-border bg-card px-2 text-xs gap-1 flex items-center hover:bg-accent transition-colors";
					button.innerHTML = `
						<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
						<span>Show more</span>
					`;
					
					// Add gradient overlay
					const overlay = document.createElement("div");
					overlay.className = "code-block-overlay absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none z-[5]";
					preElement.appendChild(overlay);
					preElement.appendChild(button);

					button.addEventListener("click", (e) => {
						e.stopPropagation();
						const isExpanded = preElement.dataset.expanded === "true";
						
						if (isExpanded) {
							preElement.style.maxHeight = `${maxHeight}px`;
							preElement.dataset.expanded = "false";
							button.innerHTML = `
								<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
								</svg>
								<span>Show more</span>
							`;
							overlay.style.display = "block";
						} else {
							preElement.style.maxHeight = `${height}px`;
							preElement.dataset.expanded = "true";
							button.innerHTML = `
								<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
								</svg>
								<span>Show less</span>
							`;
							overlay.style.display = "none";
						}
					});
				}
			});
		};

		// Process immediately
		processCodeBlocks();

		// Also process after a short delay to catch dynamically rendered content
		const timeoutId = setTimeout(processCodeBlocks, 100);

		return () => clearTimeout(timeoutId);
	}, [children]);

	return (
		<div ref={containerRef} className={cn("collapsible-code-container", className)}>
			{children}
		</div>
	);
}

