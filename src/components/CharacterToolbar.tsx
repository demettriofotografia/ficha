import React, { useState } from 'react';
import { type User } from 'firebase/auth';
import { Check, Cloud, LogIn, LogOut, Plus, Trash2, ChevronDown } from 'lucide-react';
import { type CharacterDocument } from '../types/character';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface CharacterToolbarProps {
  user: User | null;
  authLoading: boolean;
  characters: CharacterDocument[];
  activeCharacterId: string | null;
  saveStatus: SaveStatus;
  errorMessage: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onSelectCharacter: (id: string) => void;
  onCreateCharacter: () => void;
  onDeleteCharacter: (id: string) => void;
  onManualSave: () => void;
}

export function CharacterToolbar({
  user,
  authLoading,
  characters,
  activeCharacterId,
  saveStatus,
  errorMessage,
  onSignIn,
  onSignOut,
  onSelectCharacter,
  onCreateCharacter,
  onDeleteCharacter,
  onManualSave,
}: CharacterToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const activeChar = characters.find((c) => c.id === activeCharacterId);
  const activeLabel = activeChar?.nome?.trim() || 'Ficha sem nome';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#1c1917]/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-5xl mx-auto px-3 h-12 flex items-center justify-between gap-2">
        {authLoading ? (
          <span className="text-xs text-stone-400">Conectando...</span>
        ) : !user ? (
          <>
            <span className="text-xs sm:text-sm font-medium text-stone-300 truncate">
              Oeste Sombrio · Salve no Firebase
            </span>
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-red-900 hover:bg-red-800 text-stone-100 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Entrar com Google
            </button>
          </>
        ) : (
          <>
            {/* Character Switcher */}
            <div className="relative min-w-0 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium max-w-[165px] sm:max-w-[240px] cursor-pointer transition-colors"
              >
                <span className="truncate">{activeLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={onCreateCharacter}
                aria-label="Criar nova ficha"
                title="Nova ficha"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 shrink-0 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute left-0 top-11 z-40 w-64 rounded-xl bg-stone-900 border border-stone-700 shadow-2xl py-1.5">
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Minhas Fichas ({characters.length})
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-stone-800/70">
                      {characters.map((char) => {
                        const isSelected = char.id === activeCharacterId;
                        const label = char.nome?.trim() || 'Ficha sem nome';
                        return (
                          <div
                            key={char.id}
                            className={`flex items-center justify-between px-2 py-1 ${
                              isSelected ? 'bg-red-950/50' : 'hover:bg-stone-800/60'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onSelectCharacter(char.id);
                                setMenuOpen(false);
                              }}
                              className="flex-1 text-left px-1.5 py-2 text-xs font-medium text-stone-100 truncate cursor-pointer"
                            >
                              {label}
                              {char.nivel ? ` · Nv ${char.nivel}` : ''}
                            </button>
                            {characters.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteCharacter(char.id);
                                  setMenuOpen(false);
                                }}
                                aria-label={`Excluir ${label}`}
                                className="p-2 text-stone-400 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Real Firebase Sync Status + Sign Out */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onManualSave}
                disabled={saveStatus === 'saving'}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-stone-800/90 hover:bg-stone-700 text-xs font-medium text-stone-200 whitespace-nowrap shrink-0 cursor-pointer transition-colors disabled:opacity-60"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-amber-400" />
                    <span>Salvando...</span>
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Salvo</span>
                  </>
                ) : saveStatus === 'error' ? (
                  <span className="text-red-400">Erro · Tentar</span>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-stone-400" />
                    <span>Salvar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sair da conta"
                title="Sair"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {errorMessage && (
        <div className="bg-red-950/90 border-t border-red-900 px-3 py-1.5 text-center text-xs text-red-200">
          {errorMessage}
        </div>
      )}
    </header>
  );
}
