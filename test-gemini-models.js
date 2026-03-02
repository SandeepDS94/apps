
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('Missing API Key');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        console.log(`Success with ${modelName}:`, response.text());
        return true;
    } catch (error) {
        console.error(`Failed with ${modelName}:`, error.message);
        return false;
    }
}

async function runTests() {
    await testModel('gemini-pro');
    await testModel('gemini-2.5-flash-preview-09-2025');
    await testModel('gemini-1.5-flash');
}

runTests();
