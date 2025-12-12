import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface InspirationCardProps {
	slug: string;
	name: string;
	description?: string;
	category: string;
	tags?: string[];
	onClick?: () => void;
	onPreview?: () => void;
}

export function InspirationCard({
	slug,
	name,
	description,
	category,
	tags = [],
	onClick,
	onPreview,
}: InspirationCardProps) {
	return (
		<Card
			className="cursor-pointer transition-shadow hover:shadow-md"
			onClick={onClick}
		>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-base">{name}</CardTitle>
						<p className="text-muted-foreground mt-1 text-xs">{category}</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={(e) => {
							e.stopPropagation();
							onPreview?.();
						}}
					>
						<Eye className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			{description && (
				<CardContent>
					<p className="text-muted-foreground text-sm line-clamp-2">
						{description}
					</p>
					{tags.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1">
							{tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-muted px-2 py-0.5 text-xs"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</CardContent>
			)}
		</Card>
	);
}


