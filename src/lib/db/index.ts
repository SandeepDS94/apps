import { openDB } from 'idb';

const DB_NAME = 'ai-learning-db';
const STORE_NAME = 'offline-actions';

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
}

export async function saveOfflineAction(action: any) {
    const db = await initDB();
    await db.add(STORE_NAME, { ...action, timestamp: Date.now() });
}

export async function getOfflineActions() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

export async function clearOfflineActions() {
    const db = await initDB();
    await db.clear(STORE_NAME);
}
