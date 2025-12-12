export function createEmailGenerationPrompt(
	userRequest: string,
	inspirationContext?: string,
): string {
	let prompt = `Create an email template based on this request: ${userRequest}`;

	if (inspirationContext) {
		prompt += `\n\nUse this template as inspiration:\n${inspirationContext}`;
	}

	prompt +=
		"\n\nGenerate the React Email component code. Make it modern, responsive, and visually appealing.";

	return prompt;
}


