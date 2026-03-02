import { generateResources } from '@/lib/gemini';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { topic } = await request.json();
        const resources = await generateResources(topic);

        // Save to Supabase
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                { global: { headers: { Authorization: authHeader } } }
            );

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { error } = await supabase
                    .from('study_materials')
                    .insert({
                        user_id: user.id,
                        topic: topic,
                        content: JSON.stringify(resources),
                        type: 'resources'
                    });

                if (error) {
                    console.error('Error saving resources to Supabase:', error);
                } else {
                    console.log('Resources saved to Supabase');
                }
            }
        }

        return NextResponse.json({ resources });
    } catch (error) {
        console.error('Error generating resources:', error);
        return NextResponse.json({ error: 'Failed to generate resources' }, { status: 500 });
    }
}
