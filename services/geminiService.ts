import { QuizQuestion } from "../types";

const getHeaders = () => {
  const token = localStorage.getItem('vidyasetu_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const generateRAGResponse = async (userQuery: string, role: string): Promise<string> => {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message: userQuery, role })
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.text || "No response received.";
  } catch (error) {
    console.error("Gemini RAG Client Error:", error);
    return "I am having trouble connecting to the backend service. Please try again later.";
  }
};

/**
 * Generates a quiz based on a topic using the backend API.
 */
export const generateQuizQuestions = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const res = await fetch('/api/gemini/quiz', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic })
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.questions || [];
  } catch (error) {
    console.error("Quiz Generation Client Error:", error);
    return [];
  }
};

/**
 * Compresses study material (images/PDFs) into a concise gist using the backend API.
 */
export const compressStudyMaterial = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const res = await fetch('/api/gemini/compress', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ base64: base64Data, mimeType })
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.text || "Could not analyze the document.";
  } catch (error) {
    console.error("Compression Client Error:", error);
    return "Failed to compress document. Please ensure it is a valid image or PDF.";
  }
};