import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface AnalysisResult {
  aiLikelihood: string;
  reasons: string[];
  humanizedVersion: string;
  improvementTips: string[];
}

export async function analyzeAndHumanize(text: string, intensity: 'standard' | 'aggressive' = 'standard'): Promise<AnalysisResult> {
  const genAI = getGenAI();
  const prompt = `You are a world-class academic editor and linguistic expert specializing in "Human-Centric" scholarly writing. Your mission is to take a piece of text and rewrite it so it is indistinguishable from high-level human academic writing, specifically targeting the bypass of AI detection algorithms (like ZeroGPT, Originality.ai, etc.).

### INTENSITY LEVEL: ${intensity.toUpperCase()}

### CORE STRATEGY:
1. **Disrupt "AI Uniformity"**: AI tends to produce sentences of similar length and structure. You MUST break this. Mix very short, punchy sentences with long, complex, multi-clause academic sentences.
2. **Linguistic Perplexity**: Use a sophisticated, varied vocabulary. Avoid "safe" or "common" academic words that AI overuses (e.g., "crucial," "essential," "moreover," "furthermore"). Instead, use more precise, context-specific terminology.
3. **Burstiness & Flow**: Create a "rhythm" in the writing. Use parentheticals, rhetorical questions (sparingly), and varied sentence starters (don't start every sentence with a Subject-Verb).
4. **Active Voice & Agency**: AI often defaults to a detached, passive voice. Use more active verbs and give "agency" to the researchers or the data where appropriate.
5. **Stylistic Nuance**: Introduce subtle stylistic choices that reflect a unique human voice—such as starting a sentence with a conjunction (e.g., "But," "Yet") for emphasis, or using an em-dash for a sudden shift in thought.
6. **Maintain Academic Rigor**: The result must still be professional, credible, and suitable for a top-tier journal. Do NOT lose the technical accuracy of the original text.

### OUTPUT FORMAT (STRICT):
Do not include any introductory text or markdown code blocks. Start directly with the sections.

--- ANALYSIS ---
AI Likelihood: [Low/Medium/High] - [Brief explanation of why it looks like AI]
Reasons:
- [Specific pattern 1]
- [Specific pattern 2]
- [Specific pattern 3]

--- HUMANIZED VERSION ---
[Your rewritten text. If intensity is 'aggressive', be bolder with stylistic changes while keeping the meaning intact.]

--- IMPROVEMENT TIPS ---
- [Tip 1]
- [Tip 2]
- [Tip 3]

TEXT TO ANALYZE:
${text}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();
    
    if (!output) {
      throw new Error("Empty response from Gemini API");
    }

    return parseOutput(output);
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please check your Vercel Environment Variables.");
    }
    throw error;
  }
}

function parseOutput(output: string): AnalysisResult {
  // Clean up potential markdown blocks if Gemini ignores instructions
  const cleanOutput = output.replace(/```[a-z]*\n?|```/gi, '').trim();

  const analysisMatch = cleanOutput.match(/--- ANALYSIS ---([\s\S]*?)--- HUMANIZED VERSION ---/i);
  const humanizedMatch = cleanOutput.match(/--- HUMANIZED VERSION ---([\s\S]*?)--- IMPROVEMENT TIPS ---/i);
  const tipsMatch = cleanOutput.match(/--- IMPROVEMENT TIPS ---([\s\S]*)/i);

  if (!analysisMatch || !humanizedMatch || !tipsMatch) {
    console.warn("Parsing failed for output:", cleanOutput);
    // Fallback parsing or throw error
    return {
      aiLikelihood: "Analysis failed",
      reasons: ["The model output could not be parsed correctly."],
      humanizedVersion: cleanOutput.split('--- HUMANIZED VERSION ---')[1]?.split('--- IMPROVEMENT TIPS ---')[0]?.trim() || cleanOutput,
      improvementTips: ["Try a shorter text or check for unusual characters."]
    };
  }

  const analysisText = analysisMatch[1].trim();
  const humanizedVersion = humanizedMatch[1].trim();
  const tipsText = tipsMatch[1].trim();

  const likelihoodLine = analysisText.split('\n').find(l => l.toLowerCase().includes('ai likelihood:'));
  const aiLikelihood = likelihoodLine ? likelihoodLine.split(/ai likelihood:/i)[1].trim() : "Unknown";

  const reasons = analysisText
    .split('\n')
    .filter(l => l.trim().startsWith('-'))
    .map(l => l.trim().substring(1).trim());

  const improvementTips = tipsText
    .split('\n')
    .filter(l => l.trim().startsWith('-'))
    .map(l => l.trim().substring(1).trim());

  return {
    aiLikelihood,
    reasons,
    humanizedVersion,
    improvementTips,
  };
}
