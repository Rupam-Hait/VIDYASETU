import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini Client
// In standard @google/genai, it automatically reads process.env.GEMINI_API_KEY if no key is provided.
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY is not set in environment variables.');
}
const ai = new GoogleGenAI({ apiKey });

const SCHOOL_KNOWLEDGE_BASE = [
  {
    id: "kb_1",
    category: "policy",
    content: "School hours are from 8:00 AM to 2:30 PM. Late arrival after 8:15 AM is marked as half-day."
  },
  {
    id: "kb_2",
    category: "fees",
    content: "Tuition fees must be paid by the 10th of every quarter. A fine of $50 applies for late payments. Online payment is available via the portal."
  },
  {
    id: "kb_3",
    category: "exam",
    content: "Mid-term exams for 2026 are scheduled from October 15th to October 25th. The grading system uses GPA scale 4.0."
  },
  {
    id: "kb_4",
    category: "transport",
    content: "Bus Route 5 covers the Downtown area. The driver is Mr. Singh, contact: 555-0123. Real-time tracking is enabled in the app."
  },
  {
    id: "kb_5",
    category: "library",
    content: "Students can borrow up to 3 books for 14 days. Lost books incur a replacement fee plus 20% processing charge."
  },
  {
    id: "kb_6",
    category: "contact",
    content: "Principal office email: principal@vidyasetu.edu. Tech support: support@vidyasetu.edu."
  },
  {
    id: "kb_7",
    category: "sports",
    content: "Annual Sports Day is on December 12th. Registration for cricket, football, and athletics opens on November 1st."
  },
  {
    id: "kb_8",
    category: "cafeteria",
    content: "The cafeteria serves breakfast from 7:30 AM to 8:30 AM and lunch from 12:00 PM to 1:30 PM. Weekly menu is available on the notice board."
  },
  {
    id: "kb_9",
    category: "holidays",
    content: "Winter break starts from December 24th to January 5th. Summer break is from May 15th to June 30th."
  },
  {
    id: "kb_10",
    category: "policy",
    content: "Mobile phones are strictly prohibited in classrooms. If found, they will be confiscated for a week."
  },
  {
    id: "kb_11",
    category: "uniform",
    content: "Boys: White shirt, grey trousers, school tie. Girls: White shirt, grey skirt/trousers. Black shoes are mandatory."
  }
];

/**
 * Enhanced RAG retrieval mechanism.
 */
const retrieveRelevantContext = (query) => {
  const lowerQuery = query.toLowerCase();
  const queryTokens = lowerQuery.split(/[ ?.,!]+/).filter(t => t.length > 3);

  if (queryTokens.length === 0) return { contextString: "", sources: [] };
  
  const scoredDocs = SCHOOL_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    const contentLower = doc.content.toLowerCase();
    queryTokens.forEach(token => {
      if (contentLower.includes(token)) score++;
    });
    return { doc, score };
  });

  const topDocs = scoredDocs
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(d => d.doc);

  if (topDocs.length === 0) return { contextString: "", sources: [] };

  const contextString = topDocs.map(doc => `- ${doc.content}`).join("\n");
  const sources = Array.from(new Set(topDocs.map(d => d.category)));

  return { contextString, sources };
};

export const generateRAGResponse = async (userQuery, role) => {
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
      model: 'gemini-2.5-flash', // Upgraded to stable gemini-2.5-flash
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + `\n\nUser Question: ${userQuery}` }] }
      ]
    });

    let finalText = response.text || "I apologize, I couldn't generate a response at this moment.";

    if (sources.length > 0) {
      finalText += `\n\nSources: ${sources.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`;
    }

    return finalText;
  } catch (error) {
    console.error("Gemini RAG Error on Server:", error);
    return "I am having trouble connecting to the knowledge base. Please try again later.";
  }
};

export const generateQuizQuestions = async (topic) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Upgraded to stable gemini-2.5-flash
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
      return JSON.parse(response.text);
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Quiz Generation Error on Server:", error);
    return [];
  }
};

export const compressStudyMaterial = async (base64Data, mimeType) => {
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
      model: 'gemini-2.5-flash', // Upgraded to stable gemini-2.5-flash
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: prompt }
          ]
        }
      ]
    });

    return response.text || "Could not analyze the document.";
  } catch (error) {
    console.error("Compression Error on Server:", error);
    return "Failed to compress document. Please ensure it is a valid image or PDF.";
  }
};
