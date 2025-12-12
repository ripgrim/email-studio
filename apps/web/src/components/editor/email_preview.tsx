import { useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editor";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/ai-elements/loader";
import { AlertCircle, Eye, Code } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeEditor } from "./code_editor";

// Inject font stylesheets into HTML for iframe preview
function injectFontsIntoHtml(html: string): string {
	// Google Fonts for Geist Variable equivalents
	const fontStyles = `
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet">
		<style>
			* {
				font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
			}
			code, pre, .font-mono {
				font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
			}
		</style>
	`;
	
	// Inject into <head> if it exists, otherwise create one
	if (html.includes('<head>')) {
		return html.replace('<head>', `<head>${fontStyles}`);
	} else if (html.includes('<html>')) {
		return html.replace('<html>', `<html><head>${fontStyles}</head>`);
	} else {
		// Fallback: prepend to the beginning
		return `${fontStyles}${html}`;
	}
}

export function EmailPreview() {
	const { previewHtml, code, setPreviewHtml } = useEditorStore();
	const [isRendering, setIsRendering] = useState(false);
	const [renderError, setRenderError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

	// Auto-render when code changes
	useEffect(() => {
		if (!code) {
			setPreviewHtml("");
			setRenderError(null);
			return;
		}

		// Debounce rendering
		const timeoutId = setTimeout(async () => {
			setIsRendering(true);
			setRenderError(null);
			try {
				const { renderEmailTemplate } = await import(
					"@inbound-hackathon/email/renderer"
				);
				const { html } = await renderEmailTemplate(code);
				setPreviewHtml(html);
			} catch (error) {
				console.error("Failed to render preview:", error);
				setRenderError(
					error instanceof Error ? error.message : "Failed to render preview"
				);
			} finally {
				setIsRendering(false);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [code, setPreviewHtml]);

	if (!code) {
		return (
			<div className="flex h-full flex-col border-l border-border bg-background">
				<div className="border-b border-border bg-background px-4 py-2">
					<h2 className="text-sm font-medium">Preview</h2>
				</div>
				<div className="flex flex-1 items-center justify-center p-4 text-center">
					<p className="text-sm text-muted-foreground">
						Start a conversation to generate an email
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col border-l border-border bg-background min-w-0 overflow-hidden">
			{/* Tabs Header */}
			<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "code")} className="flex h-full w-full flex-col min-h-0 min-w-0 overflow-hidden">
				<div className="shrink-0 flex items-center justify-between border-b border-border bg-background px-4 py-2">
					<TabsList className="h-7">
						<TabsTrigger value="preview" className="h-6 gap-1.5 px-2 text-xs">
							<Eye className="h-3 w-3" />
							Preview
						</TabsTrigger>
						<TabsTrigger value="code" className="h-6 gap-1.5 px-2 text-xs">
							<Code className="h-3 w-3" />
							Code
						</TabsTrigger>
					</TabsList>
					{isRendering && activeTab === "preview" && (
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<Loader size={12} />
							<span>Rendering...</span>
						</div>
					)}
				</div>

				{/* Preview Tab */}
				<TabsContent value="preview" className="flex-1 overflow-hidden m-0 flex-col min-h-0 h-full">
					{isRendering && !previewHtml ? (
						<div className="flex h-full items-center justify-center p-4">
							<div className="text-center">
								<Loader size={16} />
								<p className="mt-2 text-xs text-muted-foreground">Rendering...</p>
							</div>
						</div>
					) : renderError ? (
						<div className="h-full overflow-y-auto style-scrollbar p-4">
							<div className="rounded border border-destructive/50 bg-destructive/5 p-3">
								<div className="mb-2 flex items-center gap-1.5">
									<AlertCircle className="h-4 w-4 text-destructive" />
									<h3 className="text-xs font-medium text-destructive">Error</h3>
								</div>
								<p className="text-xs text-destructive/80">{renderError}</p>
							</div>
						</div>
					) : previewHtml ? (
						<div className="h-full overflow-y-auto style-scrollbar bg-muted/30">
							<iframe
								srcDoc={injectFontsIntoHtml(previewHtml)}
								sandbox="allow-same-origin allow-scripts"
								className="h-full w-full border-0"
								title="Email Preview"
							/>
						</div>
					) : (
						<div className="h-full overflow-y-auto style-scrollbar space-y-2 p-4">
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-3/4" />
							<Skeleton className="h-3 w-1/2" />
						</div>
					)}
				</TabsContent>

				{/* Code Tab */}
				<TabsContent value="code" className="flex-1 overflow-hidden m-0 flex-col min-h-0 h-full">
					<div className="h-full overflow-y-auto style-scrollbar">
						<CodeEditor />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

