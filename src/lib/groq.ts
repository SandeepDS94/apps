import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    difficulty: string;
}

export async function generateQuizWithGroq(topic: string, difficulty: string, count: number = 5): Promise<QuizQuestion[]> {
    const prompt = `Generate a quiz about "${topic}" with ${count} questions. 
  Difficulty level: ${difficulty}.
  
  The output MUST be a valid JSON array of objects. Each object must strictly follow this structure:
  {
    "question": "The question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "The correct option text (must be exactly one of the options)",
    "explanation": "A concise explanation of why the answer is correct.",
    "difficulty": "${difficulty}"
  }

  Do not include any markdown formatting (like \`\`\`json). Return ONLY the raw JSON string.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
        });

        const content = chatCompletion.choices[0]?.message?.content || '';
        // Clean up if there are code blocks despite instructions
        const cleanText = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating quiz with Groq:", error);
        return [];
    }
}

export async function generateNotesWithGroq(topic: string): Promise<string> {
    const prompt = `
    You are an expert AI tutor. Please generate comprehensive and easy-to-understand study notes for the topic: "${topic}".
    
    Format the response in Markdown with the following structure:
    # ${topic}
    ## Key Concepts
    (List key concepts with brief explanations)
    
    ## Detailed Explanation
    (Deep dive into the topic)
    
    ## Examples / Case Studies
    (Provide real-world examples)
    
    ## Summary
    (Brief summary)
    
    Use bullet points, bold text, and clear headings.
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
        });

        return chatCompletion.choices[0]?.message?.content || "Failed to generate notes.";
    } catch (error) {
        console.error("Error generating notes with Groq:", error);
        throw error;
    }
}

export async function chatWithGroq(message: string, history: { role: 'user' | 'model', parts: string }[]): Promise<string> {
    // Convert history to Groq format
    const groqMessages = history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts
    }));

    // Add the new message
    groqMessages.push({ role: 'user', content: message });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: groqMessages as any,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 500
        });

        return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Error in chat with Groq:", error);
        throw error;
    }
}

export async function generateRiddleWithGroq(): Promise<{ riddle: string, answer: string }> {
    const themes = ["nature", "technology", "space", "history", "mathematics", "logic", "everyday objects", "animals", "abstract concepts"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const prompt = `
    Generate a creative, challenging, and unique riddle about ${randomTheme}.
    
    Structure the response strictly as a JSON object:
    {
      "riddle": "The riddle text here",
      "answer": "The answer here"
    }
    
    Do not include any markdown formatting. Return ONLY the JSON string.
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.9,
        });

        const content = chatCompletion.choices[0]?.message?.content || '';
        const cleanText = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const json = JSON.parse(cleanText);

        return {
            riddle: json.riddle || "I have no mouth but I always reply when you speak to me. What am I?",
            answer: json.answer || "An Echo"
        };
    } catch (error) {
        console.error("Error generating riddle with Groq:", error);
        return {
            riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
            answer: "An Echo"
        };
    }
}
