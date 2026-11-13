import React, { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { Plus, Trash2 } from 'lucide-react';
import { CharacterSheet } from './components/CharacterSheet';
import { CharacterToolbar, type SaveStatus } from './components/CharacterToolbar';
import {
  createCharacterSheet,
  deleteCharacterSheet,
  subscribeToUserCharacters,
  updateCharacterSheet,
} from './lib/characterService';
import { auth, googleProvider } from './lib/firebase';
import {
  type CharacterDocument,
  type CharacterSheetData,
  createEmptyCharacterSheet,
  sanitizeCharacterSheet,
} from './types/character';

const LOCAL_DRAFT_KEY = 'oeste_sombrio_draft_v1';

function loadLocalDraft(): CharacterSheetData {
  try {
    const raw = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (!raw) return createEmptyCharacterSheet();
    return sanitizeCharacterSheet(JSON.parse(raw) as CharacterSheetData);
  } catch {
    return createEmptyCharacterSheet();
  }
}

function hasAnySheetContent(sheet: CharacterSheetData): boolean {
  if (
    sheet.nome.trim() ||
    sheet.nivel.trim() ||
    sheet.experienciaAtual.trim() ||
    sheet.experienciaTotal.trim() ||
    sheet.defesa.trim() ||
    sheet.iniciativa.trim() ||
    sheet.fadiga > 0 ||
    sheet.tambor !== '000000' ||
    sheet.protecao.trim() ||
    sheet.armaCurtaDado ||
    sheet.armaCurtaTexto.trim() ||
    sheet.armaLongaDado ||
    sheet.armaLongaTexto.trim() ||
    sheet.corpoACorpoDado ||
    sheet.corpoACorpoTexto.trim() ||
    sheet.equipamentos.trim()
  ) {
    return true;
  }
  return Object.values(sheet.pericias).some((val) => val !== '');
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [characters, setCharacters] = useState<CharacterDocument[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [sheet, setSheet] = useState<CharacterSheetData>(() => loadLocalDraft());
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDirtyRef = useRef(false);
  const isSavingRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const creatingInitialRef = useRef(false);
  const latestSheetRef = useRef<CharacterSheetData>(sheet);
  const activeIdRef = useRef<string | null>(activeCharacterId);

  latestSheetRef.current = sheet;
  activeIdRef.current = activeCharacterId;

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (!firebaseUser) {
        setCharacters([]);
        setActiveCharacterId(null);
        setSaveStatus('idle');
        isDirtyRef.current = false;
        creatingInitialRef.current = false;
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to user's characters in Firestore when authenticated
  useEffect(() => {
    if (authLoading || !user) return;

    const unsubscribe = subscribeToUserCharacters(
      user.uid,
      async (docs) => {
        setErrorMessage(null);
        setCharacters(docs);

        if (docs.length === 0) {
          if (!creatingInitialRef.current) {
            creatingInitialRef.current = true;
            try {
              const seedData = hasAnySheetContent(latestSheetRef.current)
                ? latestSheetRef.current
                : createEmptyCharacterSheet();
              const newId = await createCharacterSheet(user.uid, seedData);
              setActiveCharacterId(newId);
              setSheet(seedData);
              setSaveStatus('saved');
              localStorage.removeItem(LOCAL_DRAFT_KEY);
            } catch (err) {
              setErrorMessage(
                err instanceof Error ? 'Erro ao criar ficha inicial no Firebase.' : 'Erro ao salvar.',
              );
              setSaveStatus('error');
            } finally {
              creatingInitialRef.current = false;
            }
          }
          return;
        }

        const currentId = activeIdRef.current;
        const matched = currentId ? docs.find((d) => d.id === currentId) : docs[0];
        const target = matched || docs[0];

        if (!currentId || !matched) {
          setActiveCharacterId(target.id);
          setSheet(sanitizeCharacterSheet(target));
          isDirtyRef.current = false;
          setSaveStatus('saved');
        } else if (!isDirtyRef.current && !isSavingRef.current) {
          setSheet(sanitizeCharacterSheet(target));
        }
      },
      (err) => {
        console.error(err);
        if (err.message.includes('Quota exceeded')) {
          setErrorMessage('Limite diário de leituras do Firestore atingido. Tente novamente amanhã.');
        } else {
          setErrorMessage('Não foi possível sincronizar suas fichas com o Firebase.');
        }
        setSaveStatus('error');
      },
    );

    return () => unsubscribe();
  }, [authLoading, user]);

  const flushSave = useCallback(async (charId: string, dataToSave: CharacterSheetData) => {
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    isSavingRef.current = true;
    setSaveStatus('saving');
    setErrorMessage(null);

    try {
      await updateCharacterSheet(charId, dataToSave);
      isDirtyRef.current = false;
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setErrorMessage('Falha ao salvar alterações no Firebase.');
    } finally {
      isSavingRef.current = false;
    }
  }, []);

  const handleSheetChange = useCallback(
    (updater: (prev: CharacterSheetData) => CharacterSheetData) => {
      setSheet((prev) => {
        const next = sanitizeCharacterSheet(updater(prev));
        latestSheetRef.current = next;

        if (!user || !activeIdRef.current) {
          try {
            localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(next));
          } catch {
            // Ignore storage quota errors
          }
          return next;
        }

        const charId = activeIdRef.current;
        isDirtyRef.current = true;
        setSaveStatus('saving');

        if (saveTimerRef.current !== null) {
          window.clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = window.setTimeout(() => {
          void flushSave(charId, latestSheetRef.current);
        }, 550);

        return next;
      });
    },
    [flushSave, user],
  );

  // Cleanup pending timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const handleSignIn = async () => {
    setErrorMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setErrorMessage('Não foi possível entrar com o Google.');
    }
  };

  const handleSignOut = async () => {
    if (saveTimerRef.current !== null && user && activeCharacterId && isDirtyRef.current) {
      await flushSave(activeCharacterId, latestSheetRef.current);
    }
    try {
      await signOut(auth);
      setSheet(createEmptyCharacterSheet());
      setSaveStatus('idle');
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao sair da conta.');
    }
  };

  const handleSelectCharacter = async (id: string) => {
    if (id === activeCharacterId) return;
    if (user && activeCharacterId && isDirtyRef.current) {
      await flushSave(activeCharacterId, latestSheetRef.current);
    }
    const found = characters.find((c) => c.id === id);
    if (found) {
      setActiveCharacterId(found.id);
      setSheet(sanitizeCharacterSheet(found));
      isDirtyRef.current = false;
      setSaveStatus('saved');
    }
  };

  const handleCreateCharacter = async () => {
    if (!user) return;
    if (activeCharacterId && isDirtyRef.current) {
      await flushSave(activeCharacterId, latestSheetRef.current);
    }
    try {
      setSaveStatus('saving');
      const fresh = createEmptyCharacterSheet();
      const newId = await createCharacterSheet(user.uid, fresh);
      setActiveCharacterId(newId);
      setSheet(fresh);
      isDirtyRef.current = false;
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao criar nova ficha.');
      setSaveStatus('error');
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!user || characters.length <= 1) return;
    try {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      isDirtyRef.current = false;
      await deleteCharacterSheet(id);
      if (activeCharacterId === id) {
        const remaining = characters.filter((c) => c.id !== id);
        if (remaining[0]) {
          setActiveCharacterId(remaining[0].id);
          setSheet(sanitizeCharacterSheet(remaining[0]));
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao excluir ficha.');
    }
  };

  const handleManualSave = () => {
    if (user && activeCharacterId) {
      void flushSave(activeCharacterId, latestSheetRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1917] flex flex-col">
      <CharacterToolbar
        user={user}
        authLoading={authLoading}
        characters={characters}
        activeCharacterId={activeCharacterId}
        saveStatus={saveStatus}
        errorMessage={errorMessage}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onSelectCharacter={handleSelectCharacter}
        onCreateCharacter={handleCreateCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        onManualSave={handleManualSave}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-1.5 py-2.5 sm:px-4 sm:py-6 flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-6">
        {/* Desktop Character Roster (visible only on large screens when signed in) */}
        {user && (
          <aside className="hidden lg:flex flex-col w-60 shrink-0 rounded-xl bg-stone-900/90 border border-stone-800 p-4 text-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Personagens
              </h2>
              <button
                type="button"
                onClick={handleCreateCharacter}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-300 hover:text-red-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {characters.map((char) => {
                const isSelected = char.id === activeCharacterId;
                const label = char.nome?.trim() || 'Ficha sem nome';
                return (
                  <div
                    key={char.id}
                    className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                      isSelected
                        ? 'bg-red-950/70 text-stone-100 border border-red-900/60'
                        : 'hover:bg-stone-800/70 text-stone-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectCharacter(char.id)}
                      className="flex-1 text-left truncate cursor-pointer font-medium"
                    >
                      {label}
                      {char.nivel ? ` · Nv ${char.nivel}` : ''}
                    </button>
                    {characters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCharacter(char.id)}
                        aria-label={`Excluir ${label}`}
                        className="p-1 text-stone-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* The Exact Oeste Sombrio Vertical Sheet */}
        <div className="w-full lg:flex-1 flex justify-center">
          <CharacterSheet sheet={sheet} onChange={handleSheetChange} />
        </div>
      </main>
    </div>
  );
}
