
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DocumentFile, Rule } from "../types";

// Corrected initialization to use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
