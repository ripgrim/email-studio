"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface WebPreviewContextValue {
	url: string;
	setUrl: (url: string) => void;
}

const WebPreviewContext = React.createContext<WebPreviewContextValue | undefined>(
	undefined,
);

function useWebPreviewContext() {
	const context = React.useContext(WebPreviewContext);
	if (!context) {
		throw new Error("WebPreview components must be used within WebPreview");
	}
	return context;
}

export interface WebPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
	defaultUrl?: string;
	onUrlChange?: (url: string) => void;
}

export const WebPreview = React.forwardRef<HTMLDivElement, WebPreviewProps>(
	({ defaultUrl = "", onUrlChange, className, children, ...props }, ref) => {
		const [url, setUrlState] = React.useState(defaultUrl);

		const setUrl = React.useCallback(
			(newUrl: string) => {
				setUrlState(newUrl);
				onUrlChange?.(newUrl);
			},
			[onUrlChange],
		);

		React.useEffect(() => {
			if (defaultUrl !== url) {
				setUrl(defaultUrl);
			}
		}, [defaultUrl]);

		const contextValue = React.useMemo(
			() => ({ url, setUrl }),
			[url, setUrl],
		);

		return (
			<WebPreviewContext.Provider value={contextValue}>
				<div
					ref={ref}
					className={cn(
						"flex size-full flex-col bg-card rounded-lg border",
						className,
					)}
					{...props}
				>
					{children}
				</div>
			</WebPreviewContext.Provider>
		);
	},
);
WebPreview.displayName = "WebPreview";

export interface WebPreviewNavigationProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export const WebPreviewNavigation = React.forwardRef<
	HTMLDivElement,
	WebPreviewNavigationProps
>(({ className, children, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				"flex items-center gap-1 border-b p-2 h-14",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
});
WebPreviewNavigation.displayName = "WebPreviewNavigation";

export interface WebPreviewUrlProps
	extends React.ComponentProps<"input"> {}

export const WebPreviewUrl = React.forwardRef<HTMLInputElement, WebPreviewUrlProps>(
	({ className, ...props }, ref) => {
		const { url, setUrl } = useWebPreviewContext();

		return (
			<input
				ref={ref}
				type="text"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				className={cn(
					"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		);
	},
);
WebPreviewUrl.displayName = "WebPreviewUrl";

export interface WebPreviewBodyProps
	extends Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, 'loading'> {
	loading?: React.ReactNode;
	loadingAttr?: "eager" | "lazy";
}

export const WebPreviewBody = React.forwardRef<
	HTMLIFrameElement,
	WebPreviewBodyProps
>(({ className, loading, loadingAttr, src, srcDoc, ...props }, ref) => {
	const context = React.useContext(WebPreviewContext);
	const [isLoading, setIsLoading] = React.useState(true);
	const iframeRef = React.useRef<HTMLIFrameElement>(null);
	
	// Use src from context if available, otherwise use provided src or srcdoc
	const iframeSrc = src || (context?.url && !srcDoc ? context.url : undefined);

	// Note: React Email's Tailwind component processes Tailwind classes at render time
	// and inlines the styles, so no additional CSS injection is needed

	const handleLoad = () => {
		setIsLoading(false);
	};

	return (
		<div className="relative flex-1 overflow-hidden">
			{loading && isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
					{loading}
				</div>
			)}
			<iframe
				ref={(el) => {
					iframeRef.current = el;
					if (typeof ref === 'function') {
						ref(el);
					} else if (ref) {
						ref.current = el;
					}
				}}
				src={iframeSrc || (srcDoc ? undefined : "about:blank")}
				srcDoc={srcDoc}
				loading={loadingAttr}
				className={cn(
					"size-full border-0 bg-white",
					className,
				)}
				onLoad={handleLoad}
				{...props}
			/>
		</div>
	);
});
WebPreviewBody.displayName = "WebPreviewBody";

