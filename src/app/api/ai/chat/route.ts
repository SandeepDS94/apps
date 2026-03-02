import { NextResponse } from 'next/server';
import { chatWithGroq } from '@/lib/groq';

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        console.log('Chat Request:', { message, historyLength: history?.length });

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // history coming from frontend is likely [{ role: 'user'|'model', parts: string }] assuming previous implementation
        // We need to map 'model' to 'assistant' handled in service or just pass raw if we updated service to match

        // My chatWithGroq expects { role: 'user' | 'model', parts: string }[] which matches frontend structure

        const responseText = await chatWithGroq(message, history || []);

        return NextResponse.json({ response: responseText });
    } catch (error: any) {
        console.error('Error in chat:', error);
        console.error('Error details:', error.message);
        return NextResponse.json({ error: 'Failed to process message', details: error.message }, { status: 500 });
    }
}
