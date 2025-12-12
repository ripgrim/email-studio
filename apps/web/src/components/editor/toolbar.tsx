import { Button } from "@/components/ui/button";
import { Save, Send } from "lucide-react";

interface ToolbarProps {
	onSave?: () => void;
	onSendTest?: () => void;
}

export function Toolbar({
	onSave,
	onSendTest,
}: ToolbarProps) {
	return (
		<div className="flex items-center gap-1 border-b border-border bg-background px-2 py-1.5 sm:px-3 sm:py-2">
			<Button
				variant="ghost"
				size="sm"
				onClick={onSave}
				className="h-7 gap-1.5 px-2 text-xs"
			>
				<Save className="h-3.5 w-3.5" />
				<span className="hidden sm:inline">Save</span>
			</Button>
			<Button 
				variant="ghost" 
				size="sm" 
				onClick={onSendTest}
				className="h-7 gap-1.5 px-2 text-xs"
			>
				<Send className="h-3.5 w-3.5" />
				<span className="hidden sm:inline">Send Test</span>
			</Button>
		</div>
	);
}

