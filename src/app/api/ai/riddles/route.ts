import { NextResponse } from 'next/server';
import { generateRiddleWithGroq } from '@/lib/groq';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Generating random riddle...');
        const data = await generateRiddleWithGroq();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error in riddle API:', error);
        return NextResponse.json({ error: 'Failed to generate riddle', details: error.message }, { status: 500 });
    }
}
