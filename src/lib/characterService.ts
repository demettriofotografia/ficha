import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  type CharacterDocument,
  type CharacterSheetData,
  FIELD_LIMITS,
  sanitizeCharacterSheet,
} from '../types/character';

const COLLECTION_NAME = 'characters';

export function generateCharacterId(): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return `char_${randomPart}`.slice(0, 64);
}

export function subscribeToUserCharacters(
  ownerId: string,
  onData: (characters: CharacterDocument[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  const q = query(collection(db, COLLECTION_NAME), where('ownerId', '==', ownerId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: CharacterDocument[] = snapshot.docs.map((docSnap) => {
        const raw = docSnap.data() as Record<string, unknown>;
        const sanitized = sanitizeCharacterSheet(raw as unknown as CharacterSheetData);
        return {
          ...sanitized,
          id: docSnap.id,
          ownerId: typeof raw.ownerId === 'string' ? raw.ownerId : ownerId,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        };
      });

      // Sort most recently updated/created first
      list.sort((a, b) => {
        const aTime = getTimestampMillis(a.updatedAt) || getTimestampMillis(a.createdAt);
        const bTime = getTimestampMillis(b.updatedAt) || getTimestampMillis(b.createdAt);
        return bTime - aTime;
      });

      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    },
  );
}

function getTimestampMillis(ts: unknown): number {
  if (ts && typeof ts === 'object' && 'toMillis' in ts && typeof (ts as { toMillis: () => number }).toMillis === 'function') {
    return (ts as { toMillis: () => number }).toMillis();
  }
  return 0;
}

export async function createCharacterSheet(
  ownerId: string,
  initialData: CharacterSheetData,
  explicitId?: string,
): Promise<string> {
  const characterId = explicitId && FIELD_LIMITS.idPattern.test(explicitId)
    ? explicitId.slice(0, 128)
    : generateCharacterId();

  const sanitized = sanitizeCharacterSheet(initialData);
  const docPath = `${COLLECTION_NAME}/${characterId}`;

  try {
    await setDoc(doc(db, COLLECTION_NAME, characterId), {
      ownerId,
      ...sanitized,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return characterId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function updateCharacterSheet(
  characterId: string,
  data: CharacterSheetData,
): Promise<void> {
  if (!FIELD_LIMITS.idPattern.test(characterId)) {
    throw new Error('ID de personagem inválido.');
  }

  const sanitized = sanitizeCharacterSheet(data);
  const docPath = `${COLLECTION_NAME}/${characterId}`;

  try {
    await updateDoc(doc(db, COLLECTION_NAME, characterId), {
      ...sanitized,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function deleteCharacterSheet(characterId: string): Promise<void> {
  if (!FIELD_LIMITS.idPattern.test(characterId)) {
    throw new Error('ID de personagem inválido.');
  }

  const docPath = `${COLLECTION_NAME}/${characterId}`;

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, characterId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
