import { NextResponse } from 'next/server';
import { generateNotesWithGroq } from '@/lib/groq';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        console.log('Generating notes for topic (Groq):', topic);

        const notes = await generateNotesWithGroq(topic);

        // Save to Supabase
        const authHeader = req.headers.get('Authorization');
        if (authHeader) {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                { global: { headers: { Authorization: authHeader } } }
            );

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { error } = await supabase
                    .from('notes')
                    .insert({
                        user_id: user.id,
                        topic: topic,
                        content: notes
                    });

                if (error) {
                    console.error('Error saving notes to Supabase:', error);
                } else {
                    console.log('Notes saved to Supabase');
                }
            }
        }

        return NextResponse.json({ notes });
    } catch (error: any) {
        console.error('Error generating notes:', error);
        return NextResponse.json({ error: 'Failed to generate notes', details: error.message }, { status: 500 });
    }
}
