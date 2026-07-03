import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = 'gemini-2.5-flash';

const FORMAT_INSTRUCTIONS = `You are the AI assistant for CosmosX, a space exploration platform.

Always format every response professionally. Never return large walls of text.

Rules:
- Use clear Markdown headings (##, ###).
- Start with a short overview (2-3 sentences).
- Break information into logical sections.
- Use bullet points instead of long paragraphs.
- Use numbered lists for processes or steps.
- Use tables whenever comparing data or displaying properties.
- Highlight important keywords using **bold**.
- Keep paragraphs under 3 lines.
- End with a short summary.
- Use simple, easy-to-understand English.
- Make responses visually clean.
- If the answer is long, divide it into multiple sections with proper headings.
- Never generate unstructured or continuous paragraphs.
- Do not repeat information unnecessarily.`;

const formatSteps = (history, newPrompt) => {
  const steps = [
    { type: 'user_input', content: [{ type: 'text', text: FORMAT_INSTRUCTIONS }] },
    { type: 'model_output', content: [{ type: 'text', text: 'Understood. I will follow these formatting rules for all responses.' }] },
    ...history.map((h) => ({
      type: h.role === 'user' ? 'user_input' : 'model_output',
      content: [{ type: 'text', text: h.content }],
    })),
    { type: 'user_input', content: [{ type: 'text', text: newPrompt }] },
  ];
  return steps;
};

const getOutputText = (interaction) => {
  if (interaction.output_text) return interaction.output_text;
  if (interaction.steps) {
    const texts = [];
    for (const step of interaction.steps) {
      if (step.type === 'model_output' && step.content) {
        for (const item of step.content) {
          if (item.type === 'text' && item.text) texts.push(item.text);
        }
      }
    }
    return texts.join('');
  }
  return '';
};

export const askGemini = async (prompt, history = []) => {
  const interaction = await ai.interactions.create({
    model: MODEL,
    input: formatSteps(history, prompt),
  });
  return getOutputText(interaction);
};

export const explainAstronomy = async (imageContext) => {
  const prompt = `Explain this NASA astronomy image using the formatting rules provided.\n\nImage context: ${imageContext}\n\nInclude what it depicts, its scientific significance, and why it matters.`;
  const interaction = await ai.interactions.create({
    model: MODEL,
    input: formatSteps([], prompt),
  });
  return getOutputText(interaction);
};

export default ai;
