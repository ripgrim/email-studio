import { render } from "@react-email/render";
import * as React from "react";
import { transform } from "@babel/standalone";

// Import React Email components that might be used
import * as ReactEmailComponents from "@react-email/components";
import { PlaceholderImage } from "./placeholder-image";

// Extract commonly used components
const {
	Html,
	Head,
	Body,
	Container,
	Section,
	Row,
	Column,
	Text,
	Heading,
	Button,
	Link,
	Img,
	Hr,
	Preview,
	Tailwind,
} = ReactEmailComponents;

export async function renderEmailTemplate(
	code: string,
	props: Record<string, any> = {},
): Promise<{ html: string; plainText: string }> {
	try {
		// Compile the code string into a React component
		const Component = compileCodeToComponent(code);
		
		// Render the component to HTML
		const html = await render(React.createElement(Component, props), {
			pretty: true,
		});
		const plainText = stripHtml(html);
		return { html, plainText };
	} catch (error) {
		console.error("Failed to render email template:", error);
		throw new Error(`Failed to render email template: ${error instanceof Error ? error.message : String(error)}`);
	}
}

function compileCodeToComponent(code: string): React.ComponentType<any> {
	// Remove code block markers if present
	let cleanCode = code.trim();
	if (cleanCode.startsWith("```")) {
		cleanCode = cleanCode.replace(/^```(?:jsx|tsx|javascript|typescript)?\n/, "").replace(/\n```$/, "");
	}

	// Strip out import statements - we provide these components already
	// Handle both single-line and multi-line imports
	const lines = cleanCode.split("\n");
	const filteredLines: string[] = [];
	let inImport = false;
	
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();
		
		// Skip import statements
		if (trimmed.startsWith("import ")) {
			// Check if it's a multi-line import (ends with { or ( but not })
			if (trimmed.includes("{") && !trimmed.includes("}")) {
				inImport = true;
			} else if (trimmed.includes("(") && !trimmed.includes(")")) {
				inImport = true;
			} else if (trimmed.includes("from")) {
				// Single-line import
				continue;
			}
			continue;
		}
		
		// Continue skipping if we're in a multi-line import
		if (inImport) {
			if (trimmed.includes("}") || trimmed.includes(")") || trimmed.includes("from")) {
				inImport = false;
			}
			continue;
		}
		
		// Skip CSS imports
		if (trimmed.startsWith("import '") || trimmed.startsWith('import "')) {
			continue;
		}
		
		// Skip export statements (export default, export const, etc.)
		if (trimmed.startsWith("export ")) {
			continue;
		}
		
		// Keep everything else
		filteredLines.push(line);
	}
	
	cleanCode = filteredLines.join("\n").trim();

	// Extract the JSX/component body from the code
	// Handle cases where code is wrapped in a function/const declaration
	let jsxCode = cleanCode;
	
	// Helper function to find matching closing parenthesis
	function findMatchingParen(str: string, startPos: number): number {
		let depth = 0;
		for (let i = startPos; i < str.length; i++) {
			if (str[i] === '(') depth++;
			if (str[i] === ')') {
				depth--;
				if (depth === 0) return i;
			}
		}
		return -1;
	}
	
	// Try to find return statement with proper parenthesis matching
	const returnIndex = cleanCode.indexOf("return (");
	if (returnIndex !== -1) {
		const openParen = returnIndex + "return ".length;
		const closeParen = findMatchingParen(cleanCode, openParen);
		if (closeParen !== -1) {
			// Extract the return statement including the JSX
			jsxCode = cleanCode.substring(returnIndex, closeParen + 1).trim();
			// Check if there's a semicolon after
			const afterClose = cleanCode.substring(closeParen + 1).trim();
			if (afterClose.startsWith(";")) {
				jsxCode += ";";
			} else if (!jsxCode.endsWith(";")) {
				jsxCode += ";";
			}
		} else if (cleanCode.startsWith("<")) {
			// It's JSX, wrap in return
			jsxCode = `return (${cleanCode});`;
		} else {
			// No return statement, wrap it
			jsxCode = `return (${cleanCode});`;
		}
	} else if (cleanCode.startsWith("<")) {
		// It's JSX, wrap in return
		jsxCode = `return (${cleanCode});`;
	} else if (cleanCode.includes("return")) {
		// Has return but format might be different, try to extract it
		const returnMatch = cleanCode.match(/return\s+\([\s\S]*\)/);
		if (returnMatch) {
			jsxCode = returnMatch[0].trim();
			if (!jsxCode.endsWith(";")) {
				jsxCode += ";";
			}
		} else {
			// Fallback: wrap the whole thing
			jsxCode = `return (${cleanCode});`;
		}
	} else {
		// No return statement, wrap it
		jsxCode = `return (${cleanCode});`;
	}

	// Wrap the code in a component function
	const wrappedCode = `
		(function() {
			function EmailTemplate(props) {
				${jsxCode}
			}
			return EmailTemplate;
		})();
	`;

	try {
		// Transform JSX to JavaScript using Babel
		const transformed = transform(wrappedCode, {
			presets: ["react"],
			plugins: [],
		});

		if (!transformed.code) {
			throw new Error("Babel transformation failed");
		}

		// Create a function that returns the component
		// The transformed code is an IIFE that returns the EmailTemplate function
		const componentFactory = new Function(
			"React",
			"Html",
			"Head",
			"Body",
			"Container",
			"Section",
			"Row",
			"Column",
			"Text",
			"Heading",
			"Button",
			"Link",
			"Img",
			"Hr",
			"Preview",
			"Tailwind",
			"PlaceholderImage",
			`return ${transformed.code}`
		);

		// Call the factory - it returns the EmailTemplate component function
		const Component = componentFactory(
			React,
			Html || ReactEmailComponents.Html,
			Head || ReactEmailComponents.Head,
			Body || ReactEmailComponents.Body,
			Container || ReactEmailComponents.Container,
			Section || ReactEmailComponents.Section,
			Row || ReactEmailComponents.Row,
			Column || ReactEmailComponents.Column,
			Text || ReactEmailComponents.Text,
			Heading || ReactEmailComponents.Heading,
			Button || ReactEmailComponents.Button,
			Link || ReactEmailComponents.Link,
			Img || ReactEmailComponents.Img,
			Hr || ReactEmailComponents.Hr,
			Preview || ReactEmailComponents.Preview,
			Tailwind || ReactEmailComponents.Tailwind,
			PlaceholderImage,
		);
		
		if (!Component || typeof Component !== "function") {
			throw new Error(`Failed to create component from compiled code. Got: ${typeof Component}`);
		}
		
		return Component;
	} catch (error) {
		console.error("Code compilation error:", error);
		console.error("Code that failed:", cleanCode);
		// Return a fallback component that shows the error
		return function ErrorComponent() {
			return React.createElement(
				Html,
				{},
				React.createElement(
					Body,
					{},
					React.createElement(
						Container,
						{},
						React.createElement(Text, {}, `Error compiling template: ${error instanceof Error ? error.message : String(error)}`),
					),
				),
			);
		};
	}
}

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]*>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.trim();
}

