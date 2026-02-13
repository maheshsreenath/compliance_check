
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DocumentFile, Rule } from "../types";

// Get API key - Check multiple sources for maximum compatibility
// Priority: process.env (from Vite define) > import.meta.env (Vite native)
// @ts-ignore - process.env is defined via Vite's define option
const apiKey = 
  process.env.GEMINI_API_KEY || 
  process.env.API_KEY ||
  import.meta.env.VITE_GEMINI_API_KEY || 
  '';

// Initialize AI client only if API key is available
// This allows the app to load without the key, but AI features won't work
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error('Failed to initialize Gemini AI client:', error);
  }
} else {
  console.warn('GEMINI_API_KEY is not set. AI compliance analysis features will not be available. Set VITE_GEMINI_API_KEY or GEMINI_API_KEY environment variable to enable AI features.');
}

export const analyzeCompliance = async (
  candidate: DocumentFile,
  rule: Rule,
  template?: DocumentFile
): Promise<AnalysisResult> => {
  // Use gemini-3-pro-preview for complex reasoning tasks like compliance auditing
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `
    You are a professional legal and compliance auditor.
    Your task is to analyze a candidate document against a specific compliance rule and an optional template document.
    Identify any deviations where the candidate document fails to meet the requirements of the rule or differs substantially from the template in a way that violates the instruction.
  `;

  const prompt = `
    RULE NAME: ${rule.name}
    INSTRUCTION: ${rule.instruction}
    
    ${template ? `TEMPLATE DOCUMENT CONTENT:\n${template.content}\n` : 'No template provided for this rule.'}
    
    CANDIDATE DOCUMENT CONTENT (Filename: ${candidate.name}):
    \n${candidate.content}\n
    
    Analyze the candidate document. Determine if there is a deviation. 
    Provide a concise summary and a list of specific details where the deviation occurs.
  `;

  // Check if AI client is available
  if (!ai) {
    return {
      docId: candidate.id,
      ruleId: rule.id,
      hasDeviation: false,
      summary: "API Key Not Configured",
      details: ["Please set VITE_GEMINI_API_KEY or GEMINI_API_KEY environment variable to enable AI compliance analysis."],
      severity: 'low'
    };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasDeviation: { type: Type.BOOLEAN },
            summary: { type: Type.STRING },
            details: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            severity: { 
              type: Type.STRING,
              description: "Must be 'low', 'medium', or 'high'"
            }
          },
          required: ["hasDeviation", "summary", "details", "severity"]
        }
      }
    });

    // Directly accessing .text property as per guidelines
    const result = JSON.parse(response.text || '{}');
    return {
      docId: candidate.id,
      ruleId: rule.id,
      hasDeviation: result.hasDeviation,
      summary: result.summary,
      details: result.details,
      severity: result.severity as any || 'low'
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      docId: candidate.id,
      ruleId: rule.id,
      hasDeviation: false,
      summary: "Error during analysis",
      details: ["The AI service was unable to process this document."],
      severity: 'low'
    };
  }
};
