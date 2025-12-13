import * as React from "react";
import { Img } from "@react-email/components";

interface PlaceholderImageProps {
	width?: number;
	height?: number;
	alt?: string;
	className?: string;
	text?: string;
	bgColor?: string;
	textColor?: string;
}

/**
 * Generates a placeholder image as a data URI SVG
 */
function generatePlaceholderSVG(
	width: number,
	height: number,
	text: string,
	bgColor: string = "#e5e7eb",
	textColor: string = "#6b7280"
): string {
	const svg = `
		<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
			<rect width="100%" height="100%" fill="${bgColor}"/>
			<text 
				x="50%" 
				y="50%" 
				font-family="system-ui, -apple-system, sans-serif" 
				font-size="${Math.min(width, height) / 8}px" 
				fill="${textColor}" 
				text-anchor="middle" 
				dominant-baseline="middle"
				font-weight="500"
			>${text}</text>
		</svg>
	`.trim();
	
	// URL encode the SVG for data URI (works in both Node and browser)
	const encoded = encodeURIComponent(svg);
	return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export function PlaceholderImage({
	width = 600,
	height = 400,
	alt = "Placeholder image",
	className,
	text,
	bgColor = "#e5e7eb",
	textColor = "#6b7280",
}: PlaceholderImageProps) {
	const placeholderText = text || `${width} × ${height}`;
	const src = generatePlaceholderSVG(width, height, placeholderText, bgColor, textColor);
	
	return (
		<Img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
		/>
	);
}

