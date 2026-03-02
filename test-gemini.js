const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyADxLvOwC9MhVzbOZoYnxtp8-KE8dk03lQ";
const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
    const modelName = "gemini-2.5-flash-preview-09-2025";
    console.log(`Testing Gemini API with ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Generate a quiz about "Science" with 3 questions.
  Return the response strictly as a JSON array.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('Success!', response.text());
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testGemini();
