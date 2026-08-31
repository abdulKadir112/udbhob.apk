import { ChatMessage } from '../types';

const DB_NAME = 'probashi_pwa_offline_db';
const DB_VERSION = 1;
const STORE_MESSAGES = 'chat_messages';
const STORE_PENDING_QUEUE = 'pending_outgoing_messages';
const STORE_MEDIA_CACHE = 'offline_media_cache';

/**
 * Open or upgrade IndexedDB database for offline chat & media storage
 */
function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
        const msgStore = db.createObjectStore(STORE_MESSAGES, { keyPath: 'id' });
        msgStore.createIndex('fundId', 'fundId', { unique: false });
        msgStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_PENDING_QUEUE)) {
        db.createObjectStore(STORE_PENDING_QUEUE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORE_MEDIA_CACHE)) {
        db.createObjectStore(STORE_MEDIA_CACHE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save all chat messages to IndexedDB (and localStorage fallback)
 */
export async function saveMessagesOffline(messages: ChatMessage[], fundId?: string): Promise<void> {
  if (!messages || messages.length === 0) return;

  // 1. Synchronous localStorage cache for immediate instant render
  try {
    const key = `probashi_chat_msgs_${fundId || 'all'}`;
    // Store recent 150 messages in localStorage to fit within size limits
    const recent = messages.slice(-150);
    localStorage.setItem(key, JSON.stringify(recent));
    localStorage.setItem('probashi_chat_msgs_universal', JSON.stringify(recent));
  } catch (err) {
    console.warn('LocalStorage quota warning, using IndexedDB:', err);
  }

  // 2. Full IndexedDB persistent storage (holds all messages, voice notes & images)
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(STORE_MESSAGES, 'readwrite');
    const store = tx.objectStore(STORE_MESSAGES);

    for (const msg of messages) {
      store.put(msg);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.debug('IndexedDB save note:', err);
  }
}

/**
 * Load offline cached messages from IndexedDB with localStorage fallback
 */
export async function loadMessagesOffline(fundId?: string): Promise<ChatMessage[]> {
  // Try IndexedDB first
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(STORE_MESSAGES, 'readonly');
    const store = tx.objectStore(STORE_MESSAGES);
    const request = store.getAll();

    const dbMessages = await new Promise<ChatMessage[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    if (dbMessages && dbMessages.length > 0) {
      // Sort chronologically
      dbMessages.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
      return dbMessages;
    }
  } catch (err) {
    console.debug('IndexedDB load note:', err);
  }

  // Fallback to localStorage
  try {
    const saved = localStorage.getItem(`probashi_chat_msgs_${fundId || 'all'}`) ||
                  localStorage.getItem('probashi_chat_msgs_universal');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }

  return [];
}

/**
 * Queue a message sent while offline so it auto-syncs when online
 */
export async function queueOfflineMessage(msg: ChatMessage): Promise<void> {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(STORE_PENDING_QUEUE, 'readwrite');
    tx.objectStore(STORE_PENDING_QUEUE).put(msg);
  } catch {
    // LocalStorage fallback
    try {
      const current = JSON.parse(localStorage.getItem('probashi_offline_pending_msgs') || '[]');
      current.push(msg);
      localStorage.setItem('probashi_offline_pending_msgs', JSON.stringify(current));
    } catch {}
  }
}

/**
 * Retrieve pending offline messages
 */
export async function getPendingOfflineMessages(): Promise<ChatMessage[]> {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(STORE_PENDING_QUEUE, 'readonly');
    const request = tx.objectStore(STORE_PENDING_QUEUE).getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    try {
      return JSON.parse(localStorage.getItem('probashi_offline_pending_msgs') || '[]');
    } catch {
      return [];
    }
  }
}

/**
 * Remove sent message from pending queue
 */
export async function removePendingOfflineMessage(msgId: string): Promise<void> {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(STORE_PENDING_QUEUE, 'readwrite');
    tx.objectStore(STORE_PENDING_QUEUE).delete(msgId);
  } catch {
    try {
      const current = JSON.parse(localStorage.getItem('probashi_offline_pending_msgs') || '[]');
      const filtered = current.filter((m: any) => m.id !== msgId);
      localStorage.setItem('probashi_offline_pending_msgs', JSON.stringify(filtered));
    } catch {}
  }
}
