import { AdvisorProfile } from '../types';
import { sanitizeProfileForLocalStorage } from './imageOptimizer';

const DB_NAME = 'FinAdvisor_MasterDB';
const DB_VERSION = 1;
const PROFILES_STORE = 'profiles_store';
const METADATA_STORE = 'metadata_store';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PROFILES_STORE)) {
        db.createObjectStore(PROFILES_STORE);
      }
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.warn('Failed to open IndexedDB for FinAdvisor:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

/**
 * Save full advisor profiles array to IndexedDB
 */
export async function saveProfilesToDB(profiles: AdvisorProfile[]): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PROFILES_STORE, 'readwrite');
      const store = tx.objectStore(PROFILES_STORE);
      const req = store.put(profiles, 'all_profiles');

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB saveProfilesToDB error:', err);
  }
}

/**
 * Load full advisor profiles array from IndexedDB
 */
export async function loadProfilesFromDB(): Promise<AdvisorProfile[] | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(PROFILES_STORE, 'readonly');
      const store = tx.objectStore(PROFILES_STORE);
      const req = store.get('all_profiles');

      req.onsuccess = () => {
        const result = req.result;
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Save active profile ID to IndexedDB
 */
export async function saveActiveProfileIdToDB(id: string): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(METADATA_STORE, 'readwrite');
    tx.objectStore(METADATA_STORE).put(id, 'active_profile_id');
  } catch {}
}

/**
 * Load active profile ID from IndexedDB
 */
export async function loadActiveProfileIdFromDB(): Promise<string | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(METADATA_STORE, 'readonly');
      const req = tx.objectStore(METADATA_STORE).get('active_profile_id');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Safe localStorage setter that intercepts and handles QuotaExceededError
 * Never crashes the application and prunes oversized base64 payloads if needed.
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    // If payload is already large (> 250KB), sanitize upfront to preserve localStorage room
    if (value.length > 250000 && (key.includes('profile') || key.includes('finadvisor'))) {
      try {
        const parsed = JSON.parse(value);
        const sanitized = sanitizeProfileForLocalStorage(parsed);
        const compacted = JSON.stringify(sanitized);
        localStorage.setItem(key, compacted);
        return true;
      } catch {}
    }

    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuotaExceeded =
      err?.name === 'QuotaExceededError' ||
      err?.code === 22 ||
      err?.code === 1014 ||
      err?.number === -2146828281;

    if (isQuotaExceeded) {
      try {
        // Attempt to parse JSON and prune heavy base64 strings
        const parsed = JSON.parse(value);
        const sanitized = sanitizeProfileForLocalStorage(parsed);
        const compacted = JSON.stringify(sanitized);

        localStorage.setItem(key, compacted);
        return true;
      } catch {
        // Graceful fallback: state is safely stored in IndexedDB
        return false;
      }
    }

    return false;
  }
}
