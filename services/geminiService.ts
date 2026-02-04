import { GoogleGenAI, Type } from "@google/genai";
import { SCHOOL_KNOWLEDGE_BASE } from "../constants";
import { QuizQuestion } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Enhanced RAG retrieval mechanism.
 * Returns both the context string and the sources found.
 */
const retrieveRelevantContext = (query: string): { contextString: string, sources: string[] } => {
  const lowerQuery = query.toLowerCase();
  // Filter out common stop words if needed, but simple length check is okay for now
  const queryTokens = lowerQuery.split(/[ ?.,!]+/).filter(t => t.length > 3);

  if (queryTokens.length === 0) return { contextString: "", sources: [] };
  
  // Score documents based on keyword occurrence
  const scoredDocs = SCHOOL_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    const contentLower = doc.content.toLowerCase();
    queryTokens.forEach(token => {
      if (contentLower.includes(token)) score++;
    });
    return { doc, score };
  });

  // Filter and sort by score
  const topDocs = scoredDocs
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Retrieve top 3 most relevant chunks
    .map(d => d.doc);

  if (topDocs.length === 0) return { contextString: "", sources: [] };

  const contextString = topDocs.map(doc => `- ${doc.content}`).join("\n");
  const sources = Array.from(new Set(topDocs.map(d => d.category)));

  return { contextString, sources };
};

export const generateRAGResponse = async (userQuery: string, role: string): Promise<string> => {
  try {
    const { contextString, sources } = retrieveRelevantContext(userQuery);
    
    const systemPrompt = `
      You are 'Setu', the AI assistant for VIDYASETU School App.
      User Role: ${role}.
      
      Your Goal: Answer the user's question accurately using the provided SCHOOL HANDBOOK CONTEXT.
      
      Instructions:
      1. If the answer is explicitly in the CONTEXT, use it.
      2. If the answer is NOT in the CONTEXT, you may use general knowledge but clearly state "Based on general knowledge..." or "I couldn't find a specific school policy for this...".
      3. Be polite, concise, and helpful.
      
      SCHOOL HANDBOOK CONTEXT:
      ${contextString || "No specific documents found for this query."}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + `\n\nUser Question: ${userQuery}` }] }
      ]
    });

    let finalText = response.text || "I apologize, I couldn't generate a response at this moment.";

    // Append sources if available
    if (sources.length > 0) {
      finalText += `\n\nSources: ${sources.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`;
    }

    return finalText;
  } catch (error) {
    console.error("Gemini RAG Error:", error);
    return "I am having trouble connecting to the knowledge base. Please try again later.";
  }
};

/**
 * Generates a quiz based on a topic using JSON schema for structured output.
 */
export const generateQuizQuestions = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a multiple-choice quiz with 5 questions about "${topic}" for a high school student.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" }
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return [];
  }
};

/**
 * Compresses study material (images/PDFs) into a concise gist.
 */
export const compressStudyMaterial = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const prompt = `
      Perform "Scaledown Compression" on this document.
      
      Goal: Create a highly dense study gist for exam preparation.
      
      Rules:
      1. Retain 100% of factual information, dates, formulas, and definitions.
      2. Remove all conversational text, introductions, conclusions, and redundant examples.
      3. Use bullet points and bold text for key terms.
      4. If the document is long, summarize it into key sections.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ]
      }
    });

    return response.text || "Could not analyze the document.";
  } catch (error) {
    console.error("Compression Error:", error);
    return "Failed to compress document. Please ensure it is a valid image or PDF.";
  }
};