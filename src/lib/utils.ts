
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseAiJson(text: string) {
    try {
        // 1. Remove Markdown code blocks
        let clean = text.replace(/```json/g, '').replace(/```/g, '');

        // 2. Find the JSON object (first '{' to last '}')
        const firstBrace = clean.indexOf('{');
        const lastBrace = clean.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            clean = clean.substring(firstBrace, lastBrace + 1);
        }

        // 3. Fix common JSON errors from LLMs
        // Remove trailing commas (simple regex, not perfect but helps)
        clean = clean.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        // Fix bad escaping of single quotes (JSON doesn't support \')
        clean = clean.replace(/\\'/g, "'");

        return JSON.parse(clean);
    } catch (e) {
        console.error("JSON Parse Error. Raw:", text);
        // Last resort: try to parse with a more lenient parser or return null
        throw new Error("Invalid format from AI");
    }
}
