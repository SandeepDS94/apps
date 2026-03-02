'use client';

import { useOfflineSync } from '@/hooks/useOfflineSync';

export function OfflineSyncProvider() {
    useOfflineSync();
    return null;
}
