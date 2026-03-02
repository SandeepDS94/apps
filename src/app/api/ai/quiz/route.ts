import { generateQuiz } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { topic, difficulty, amount } = await request.json();
        const questions = await generateQuiz(topic, difficulty, amount);
        return NextResponse.json({ questions });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
    }
}
