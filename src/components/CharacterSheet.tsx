import React from 'react';
import {
  type CharacterSheetData,
  DICE_OPTIONS,
  type DieValue,
  FIELD_LIMITS,
  SKILLS_LIST,
  type SkillKey,
} from '../types/character';
import {
  DecorativeLine,
  DieIcon,
  EquipmentFrame,
  OesteSombrioLogo,
  RevolverCylinder,
  ThumbTack,
} from './SheetArtwork';

interface CharacterSheetProps {
  sheet: CharacterSheetData;
  onChange: (updater: (prev: CharacterSheetData) => CharacterSheetData) => void;
}

export function CharacterSheet({ sheet, onChange }: CharacterSheetProps) {
  const updateField = <K extends keyof CharacterSheetData>(
    field: K,
    value: CharacterSheetData[K],
  ) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSkillDie = (skillKey: SkillKey, die: Exclude<DieValue, ''>) => {
    onChange((prev) => ({
      ...prev,
      pericias: {
        ...prev.pericias,
        [skillKey]: prev.pericias[skillKey] === die ? '' : die,
      },
    }));
  };

  const toggleCombatDie = (
    field: 'armaCurtaDado' | 'armaLongaDado' | 'corpoACorpoDado',
    die: Exclude<DieValue, ''>,
  ) => {
    onChange((prev) => ({
      ...prev,
      [field]: prev[field] === die ? '' : die,
    }));
  };

  const toggleChamber = (index: number) => {
    onChange((prev) => {
      const chars = prev.tambor.padEnd(6, '0').slice(0, 6).split('');
      chars[index] = chars[index] === '1' ? '0' : '1';
      return {
        ...prev,
        tambor: chars.join(''),
      };
    });
  };

  const handleFatigueClick = (level: number) => {
    onChange((prev) => ({
      ...prev,
      fadiga: prev.fadiga === level ? level - 1 : level,
    }));
  };

  return (
    <article
      className="parchment-sheet relative w-full max-w-[640px] mx-auto px-2.5 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-10 rounded-[3px] text-[#262320] overflow-hidden"
      aria-label="Ficha de personagem Oeste Sombrio"
    >
      {/* Paper thumbtacks matching the original sheet */}
      <ThumbTack className="absolute top-1 left-1.5 sm:top-2 sm:left-3 w-5 h-6 sm:w-7 sm:h-8 z-20" />
      <ThumbTack className="absolute top-1 right-1.5 sm:top-2 sm:right-3 w-5 h-6 sm:w-7 sm:h-8 z-20" />
      <ThumbTack className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-6 sm:w-7 sm:h-8 z-20" />

      {/* UPPER SECTION: Logo + Identity on Left | Revolver Cylinder + Stats on Right */}
      <div className="grid grid-cols-[1.08fr_0.96fr] gap-2 sm:gap-5 items-start">
        {/* Top-Left: Logo + NOME, NÍVEL, EXPERIÊNCIA */}
        <div className="flex flex-col">
          <div className="mb-2 sm:mb-3 pl-2 sm:pl-3">
            <OesteSombrioLogo />
          </div>

          {/* NOME */}
          <div className="flex items-end gap-1.5 mb-2 sm:mb-3">
            <label
              htmlFor="sheet-nome"
              className="font-sheet-heading font-bold uppercase text-[12px] sm:text-[15px] tracking-tight text-[#2e2a26] shrink-0 pb-[3px]"
            >
              NOME
            </label>
            <div className="flex-1 min-w-0 flex flex-col">
              <input
                id="sheet-nome"
                type="text"
                maxLength={FIELD_LIMITS.nome}
                value={sheet.nome}
                onChange={(e) => updateField('nome', e.target.value)}
                placeholder="Nome"
                className="sheet-input w-full text-[12px] sm:text-[14px] px-1 py-0.5 leading-tight"
              />
              <DecorativeLine className="-mt-[3px]" />
            </div>
          </div>

          {/* NÍVEL */}
          <div className="flex items-end gap-1.5 mb-2 sm:mb-3">
            <label
              htmlFor="sheet-nivel"
              className="font-sheet-heading font-bold uppercase text-[12px] sm:text-[15px] tracking-tight text-[#2e2a26] shrink-0 pb-[3px]"
            >
              NÍVEL
            </label>
            <div className="flex-1 min-w-0 flex flex-col">
              <input
                id="sheet-nivel"
                type="text"
                maxLength={FIELD_LIMITS.nivel}
                value={sheet.nivel}
                onChange={(e) => updateField('nivel', e.target.value)}
                placeholder="1"
                className="sheet-input w-full text-[12px] sm:text-[14px] px-1 py-0.5 leading-tight"
              />
              <DecorativeLine className="-mt-[3px]" />
            </div>
          </div>

          {/* EXPERIÊNCIA */}
          <div className="flex items-end gap-1.5 mb-2 sm:mb-3">
            <span className="font-sheet-heading font-bold uppercase text-[11.5px] sm:text-[15px] tracking-tight text-[#2e2a26] shrink-0 pb-[3px]">
              EXPERIÊNCIA
            </span>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-0.5 px-0.5">
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="sheet-xp-atual"
                    className="text-[8.5px] sm:text-[10px] italic text-[#7a736b] leading-none mb-0.5"
                  >
                    Atual
                  </label>
                  <input
                    id="sheet-xp-atual"
                    type="text"
                    inputMode="numeric"
                    maxLength={FIELD_LIMITS.experienciaAtual}
                    value={sheet.experienciaAtual}
                    onChange={(e) => updateField('experienciaAtual', e.target.value)}
                    className="sheet-input w-full text-center text-[11.5px] sm:text-[13.5px] px-0.5 py-0 leading-tight tabular-nums"
                  />
                </div>
                <span
                  className="text-[#7a736b] text-[18px] sm:text-[22px] leading-none font-light select-none px-0.5 -mb-0.5"
                  aria-hidden="true"
                >
                  /
                </span>
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="sheet-xp-total"
                    className="text-[8.5px] sm:text-[10px] italic text-[#7a736b] leading-none mb-0.5"
                  >
                    Total
                  </label>
                  <input
                    id="sheet-xp-total"
                    type="text"
                    inputMode="numeric"
                    maxLength={FIELD_LIMITS.experienciaTotal}
                    value={sheet.experienciaTotal}
                    onChange={(e) => updateField('experienciaTotal', e.target.value)}
                    className="sheet-input w-full text-center text-[11.5px] sm:text-[13.5px] px-0.5 py-0 leading-tight tabular-nums"
                  />
                </div>
              </div>
              <DecorativeLine className="-mt-[2px]" />
            </div>
          </div>
        </div>

        {/* Top-Right: Revolver Cylinder + Defesa / Iniciativa + Nível de fadiga */}
        <div className="flex flex-col">
          <div className="mb-1 sm:mb-2">
            <RevolverCylinder tambor={sheet.tambor} onToggleChamber={toggleChamber} />
          </div>

          {/* Defesa & Iniciativa */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2">
            <div className="flex flex-col">
              <label
                htmlFor="sheet-defesa"
                className="text-[11px] sm:text-[13.5px] font-bold text-[#3f3b36] leading-tight"
              >
                Defesa
              </label>
              <input
                id="sheet-defesa"
                type="text"
                maxLength={FIELD_LIMITS.defesa}
                value={sheet.defesa}
                onChange={(e) => updateField('defesa', e.target.value)}
                className="sheet-input w-full text-[12px] sm:text-[14px] px-1 py-0.5 leading-tight tabular-nums"
              />
              <DecorativeLine className="-mt-[3px]" />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="sheet-iniciativa"
                className="text-[11px] sm:text-[13.5px] font-bold text-[#3f3b36] leading-tight"
              >
                Iniciativa
              </label>
              <input
                id="sheet-iniciativa"
                type="text"
                maxLength={FIELD_LIMITS.iniciativa}
                value={sheet.iniciativa}
                onChange={(e) => updateField('iniciativa', e.target.value)}
                className="sheet-input w-full text-[12px] sm:text-[14px] px-1 py-0.5 leading-tight tabular-nums"
              />
              <DecorativeLine className="-mt-[3px]" />
            </div>
          </div>

          {/* Nível de fadiga (10 circles) */}
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-[13.5px] font-bold text-[#3f3b36] leading-tight mb-0.5">
              Nível de fadiga
            </span>
            <div
              className="grid grid-cols-10 items-center"
              role="group"
              aria-label="Nível de fadiga de 0 a 10"
            >
              {Array.from({ length: 10 }, (_, idx) => {
                const level = idx + 1;
                const isActive = level <= sheet.fadiga;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleFatigueClick(level)}
                    aria-pressed={isActive}
                    aria-label={`Fadiga nível ${level}`}
                    className="h-7 sm:h-8 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#7f1d1d] active:scale-90 transition-transform"
                  >
                    <span
                      className={`w-[13px] h-[13px] sm:w-[17px] sm:h-[17px] rounded-full border-[1.6px] transition-colors duration-150 ${
                        isActive
                          ? 'bg-[#7f1d1d] border-[#450a0a] shadow-inner'
                          : 'bg-transparent border-[#6e6860] hover:border-[#262320]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: PERÍCIAS (Left) | COMBATE + Equipamentos (Right) */}
      <div className="grid grid-cols-[1.08fr_0.96fr] gap-2 sm:gap-5 items-start mt-1 sm:mt-2">
        {/* LEFT COLUMN: PERÍCIAS */}
        <section aria-label="Perícias">
          <div className="grid grid-cols-[1fr_102px] sm:grid-cols-[1fr_140px] items-end pb-1">
            <h2 className="font-sheet-heading font-bold uppercase text-[15px] sm:text-[20px] tracking-tight text-[#2e2a26] leading-none">
              PERÍCIAS
            </h2>
            <div className="grid grid-cols-5 text-center font-bold text-[10px] sm:text-[12.5px] text-[#3f3b36] leading-none">
              {DICE_OPTIONS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {SKILLS_LIST.map((skill) => {
              const selectedDie = sheet.pericias[skill.key];
              return (
                <div
                  key={skill.key}
                  className="grid grid-cols-[1fr_102px] sm:grid-cols-[1fr_140px] items-center min-h-[28px] sm:min-h-[33px]"
                >
                  <span className="text-[10.5px] sm:text-[13.5px] font-medium text-[#2e2a26] leading-none whitespace-nowrap pr-1">
                    {skill.label}
                  </span>
                  <div
                    className="grid grid-cols-5 items-center"
                    role="group"
                    aria-label={`Dado de ${skill.label}`}
                  >
                    {DICE_OPTIONS.map((die) => {
                      const isSelected = selectedDie === die;
                      return (
                        <button
                          key={die}
                          type="button"
                          onClick={() => toggleSkillDie(skill.key, die)}
                          aria-pressed={isSelected}
                          aria-label={`${skill.label} ${die}`}
                          className="h-[28px] sm:h-[32px] w-full flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-[#7f1d1d] active:scale-90 transition-transform"
                        >
                          <DieIcon
                            die={die}
                            selected={isSelected}
                            className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: COMBATE & EQUIPAMENTOS */}
        <section aria-label="Combate e Equipamentos" className="flex flex-col h-full">
          <h2 className="font-sheet-heading font-bold uppercase text-[15px] sm:text-[20px] tracking-tight text-[#2e2a26] leading-none mb-1.5 sm:mb-2">
            COMBATE
          </h2>

          {/* Proteção */}
          <div className="flex items-end gap-1.5 mb-2.5 sm:mb-3">
            <label
              htmlFor="sheet-protecao"
              className="text-[11px] sm:text-[13.5px] font-medium text-[#3f3b36] shrink-0 pb-[3px]"
            >
              Proteção
            </label>
            <div className="flex-1 min-w-0 flex flex-col">
              <input
                id="sheet-protecao"
                type="text"
                maxLength={FIELD_LIMITS.protecao}
                value={sheet.protecao}
                onChange={(e) => updateField('protecao', e.target.value)}
                className="sheet-input w-full text-[11.5px] sm:text-[13.5px] px-1 py-0.5 leading-tight"
              />
              <DecorativeLine className="-mt-[3px]" />
            </div>
          </div>

          {/* Combat Dice Header */}
          <div className="grid grid-cols-[1fr_95px] sm:grid-cols-[1fr_135px] items-end pb-1">
            <span aria-hidden="true" />
            <div className="grid grid-cols-5 text-center font-bold text-[10px] sm:text-[12.5px] text-[#3f3b36] leading-none">
              {DICE_OPTIONS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          {/* Arma curta */}
          <div className="mb-2 sm:mb-2.5">
            <div className="grid grid-cols-[1fr_95px] sm:grid-cols-[1fr_135px] items-center min-h-[28px] sm:min-h-[32px]">
              <span className="text-[10.5px] sm:text-[13.5px] font-medium text-[#2e2a26] leading-none whitespace-nowrap pr-1">
                Arma curta
              </span>
              <div className="grid grid-cols-5 items-center" role="group" aria-label="Dado de Arma curta">
                {DICE_OPTIONS.map((die) => {
                  const isSelected = sheet.armaCurtaDado === die;
                  return (
                    <button
                      key={die}
                      type="button"
                      onClick={() => toggleCombatDie('armaCurtaDado', die)}
                      aria-pressed={isSelected}
                      aria-label={`Arma curta ${die}`}
                      className="h-[28px] sm:h-[32px] w-full flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-[#7f1d1d] active:scale-90 transition-transform"
                    >
                      <DieIcon
                        die={die}
                        selected={isSelected}
                        className="w-[15.5px] h-[15.5px] sm:w-[20px] sm:h-[20px]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col mt-0.5">
              <input
                type="text"
                aria-label="Descrição de arma curta"
                maxLength={FIELD_LIMITS.armaTexto}
                value={sheet.armaCurtaTexto}
                onChange={(e) => updateField('armaCurtaTexto', e.target.value)}
                placeholder="Ex: Revólver .45"
                className="sheet-input w-full text-[11px] sm:text-[13px] px-1 py-0.5 leading-tight"
              />
              <DecorativeLine className="-mt-[3px]" />
            </div>
          </div>

          {/* Arma longa */}
          <div className="mb-2 sm:mb-2.5">
            <div className="grid grid-cols-[1fr_95px] sm:grid-cols-[1fr_135px] items-center min-h-[28px] sm:min-h-[32px]">
              <span className="text-[10.5px] sm:text-[13.5px] font-medium text-[#2e2a26] leading-none whitespace-nowrap pr-1">
                Arma longa
              </span>
              <div className="grid grid-cols-5 items-center" role="group" aria-label="Dado de Arma longa">
                {DICE_OPTIONS.map((die) => {
                  const isSelected = sheet.armaLongaDado === die;
                  return (
                    <button
                      key={die}
                      type="button"
                      onClick={() => toggleCombatDie('armaLongaDado', die)}
                      aria-pressed={isSelected}
                      aria-label={`Arma longa ${die}`}
                      className="h-[28px] sm:h-[32px] w-full flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-[#7f1d1d] active:scale-90 transition-transform"
                    >
                      <DieIcon
                        die={die}
                        selected={isSelected}
                        className="w-[15.5px] h-[15.5px] sm:w-[20px] sm:h-[20px]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col mt-0.5">
              <input
                type="text"
                aria-label="Descrição de arma longa"
                maxLength={FIELD_LIMITS.armaTexto}
                value={sheet.armaLongaTexto}
                onChange={(e) => updateField('armaLongaTexto', e.target.value)}
                placeholder="Ex: Rifle Winchester"
                className="sheet-input w-full text-[11px] sm:text-[13px] px-1 py-0.5 leading-tight"
              />
              <DecorativeLine className="-mt-[3px]" />
            </div>
          </div>

          {/* Corpo a corpo */}
          <div className="mb-2.5 sm:mb-3">
            <div className="grid grid-cols-[1fr_95px] sm:grid-cols-[1fr_135px] items-center min-h-[28px] sm:min-h-[32px]">
              <span className="text-[10px] sm:text-[13.5px] font-medium text-[#2e2a26] leading-none whitespace-nowrap pr-1">
                Corpo a corpo
              </span>
              <div className="grid grid-cols-5 items-center" role="group" aria-label="Dado de Corpo a corpo">
                {DICE_OPTIONS.map((die) => {
                  const isSelected = sheet.corpoACorpoDado === die;
                  return (
                    <button
                      key={die}
                      type="button"
                      onClick={() => toggleCombatDie('corpoACorpoDado', die)}
                      aria-pressed={isSelected}
                      aria-label={`Corpo a corpo ${die}`}
                      className="h-[28px] sm:h-[32px] w-full flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-[#7f1d1d] active:scale-90 transition-transform"
                    >
                      <DieIcon
                        die={die}
                        selected={isSelected}
                        className="w-[15.5px] h-[15.5px] sm:w-[20px] sm:h-[20px]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col mt-0.5">
              <input
                type="text"
                aria-label="Descrição de combate corpo a corpo"
                maxLength={FIELD_LIMITS.armaTexto}
                value={sheet.corpoACorpoTexto}
                onChange={(e) => updateField('corpoACorpoTexto', e.target.value)}
                placeholder="Ex: Faca Bowie"
                className="sheet-input w-full text-[11px] sm:text-[13px] px-1 py-0.5 leading-tight"
              />
              <DecorativeLine className="-mt-[3px]" />
            </div>
          </div>

          {/* Equipamentos */}
          <div className="mt-auto">
            <EquipmentFrame>
              <div className="flex flex-col p-1.5 sm:p-2">
                <label
                  htmlFor="sheet-equipamentos"
                  className="text-[10px] sm:text-[12px] italic text-[#7a736b] leading-none mb-1 select-none"
                >
                  Equipamentos
                </label>
                <textarea
                  id="sheet-equipamentos"
                  rows={8}
                  maxLength={FIELD_LIMITS.equipamentos}
                  value={sheet.equipamentos}
                  onChange={(e) => updateField('equipamentos', e.target.value)}
                  placeholder="Munição, cantil, chapéu, corda..."
                  className="sheet-input w-full resize-none text-[11px] sm:text-[13px] leading-[1.38] min-h-[128px] sm:min-h-[168px]"
                />
              </div>
            </EquipmentFrame>
          </div>
        </section>
      </div>

      {/* Page number 79 at bottom-right just like the sheet */}
      <span
        className="absolute bottom-2.5 right-3 sm:bottom-3.5 sm:right-5 text-[10px] sm:text-[11px] font-bold text-[#2e2a26] tabular-nums select-none"
        aria-hidden="true"
      >
        79
      </span>
    </article>
  );
}
