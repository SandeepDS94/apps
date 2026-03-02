import { useEffect } from 'react';
import { getOfflineActions, clearOfflineActions } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export function useOfflineSync() {
    useEffect(() => {
        const handleOnline = async () => {
            console.log('Back online! Syncing...');
            const actions = await getOfflineActions();

            for (const action of actions) {
                try {
                    if (action.type === 'SUBMIT_QUIZ') {
                        await supabase.from('quiz_results').insert(action.payload);
                    }
                    // Handle other action types
                } catch (error) {
                    console.error('Sync failed for action:', action, error);
                }
            }

            await clearOfflineActions();
            console.log('Sync complete.');
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);
}
