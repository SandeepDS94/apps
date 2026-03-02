import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const getGenAI = () => {
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    return new GoogleGenerativeAI(apiKey);
};

export async function generateQuiz(topic: string, difficulty: string, count: number = 5) {
    const genAI = getGenAI();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const prompt = `Generate a quiz about "${topic}" with ${count} questions. Difficulty: ${difficulty}.
  Return the response strictly as a JSON array of objects. Each object should have:
  - question: string
  - options: array of 4 strings
  - answer: string (must be one of the options)
  - explanation: string (short explanation of why the answer is correct)
  - difficulty: string (must be "${difficulty}")
  
  Do not include any markdown formatting or code blocks. Just the raw JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Clean up if there are code blocks
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
}

export async function generateStudyMaterial(topic: string, type: 'notes' | 'summary' | 'flashcards') {
    const genAI = getGenAI();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const prompt = `Generate ${type} for the topic "${topic}".
  Format the output in Markdown.
  Make it comprehensive and easy to understand for a student.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating study material:", error);
        return "Failed to generate material.";
    }
}

export async function generateResources(topic: string) {
    const genAI = getGenAI();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const prompt = `Recommend 5 best study resources for "${topic}".
  Include a mix of:
  - Video tutorials (YouTube, etc.)
  - Articles/Documentation
  - Online Courses (Coursera, Udemy, etc.)
  
  Return the response strictly as a JSON array of objects. Each object should have:
  - title: string
  - url: string (valid URL)
  - type: 'video' | 'article' | 'course'
  - description: string (brief reason why it's good)
  
  Do not include any markdown formatting or code blocks. Just the raw JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating resources:", error);
        return [];
    }
}
