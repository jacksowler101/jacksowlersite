// Rough reading-time estimate (in minutes) from raw Markdown/MDX body text.
// Strips code blocks, MDX import lines, JSX/HTML tags and Markdown punctuation
// so the word count reflects prose, then assumes ~200 words per minute.
export function getReadingTime(body: string): number {
	if (!body) return 1;
	const text = body
		.replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
		.replace(/^\s*import\s.*$/gm, ' ') // MDX import statements
		.replace(/<[^>]+>/g, ' ') // JSX / HTML tags
		.replace(/[#>*_`~|[\]()-]/g, ' '); // Markdown syntax characters
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
