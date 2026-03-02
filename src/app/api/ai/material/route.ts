import { generateStudyMaterial } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { topic, type } = await request.json();
        const content = await generateStudyMaterial(topic, type);
        return NextResponse.json({ content });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate material' }, { status: 500 });
    }
}
