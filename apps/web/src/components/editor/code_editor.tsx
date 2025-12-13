import { useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editor";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { highlightCode } from "@/components/ai-elements/code-block";
import { cn } from "@/lib/utils";

export function CodeEditor() {
	const { code } = useEditorStore();
	const [html, setHtml] = useState<string>("");
	const [darkHtml, setDarkHtml] = useState<string>("");
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (!code) {
			setHtml("");
			setDarkHtml("");
			return;
		}

		highlightCode(code, "tsx", false).then(([light, dark]) => {
			setHtml(light);
			setDarkHtml(dark);
		});
	}, [code]);

	const handleCopy = async () => {
		if (!code) return;
		try {
			await navigator.clipboard.writeText(code);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	if (!code) {
		return (
			<div className="flex h-full items-center justify-center p-4">
				<p className="text-sm text-muted-foreground">
					No code to display
				</p>
			</div>
		);
	}

	return (
		<div className="relative h-full w-full overflow-hidden bg-background">
			<Button
				variant="ghost"
				size="icon"
				onClick={handleCopy}
				className="absolute right-2 top-2 z-10 h-7 w-7 text-muted-foreground hover:text-foreground"
			>
				{isCopied ? (
					<Check className="size-3.5" />
				) : (
					<Copy className="size-3.5" />
				)}
			</Button>
			<div className="h-full overflow-auto">
				<div
					className={cn(
						"dark:hidden [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:border-0 [&>pre]:p-4 [&>pre]:text-xs [&>pre]:font-mono [&>pre]:leading-relaxed [&_code]:text-xs [&_code]:font-mono [&_code]:bg-transparent",
					)}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: needed for syntax highlighting
					dangerouslySetInnerHTML={{ __html: html }}
				/>
				<div
					className={cn(
						"hidden dark:block [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:border-0 [&>pre]:p-4 [&>pre]:text-xs [&>pre]:font-mono [&>pre]:leading-relaxed [&_code]:text-xs [&_code]:font-mono [&_code]:bg-transparent",
					)}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: needed for syntax highlighting
					dangerouslySetInnerHTML={{ __html: darkHtml }}
				/>
			</div>
		</div>
	);
}

