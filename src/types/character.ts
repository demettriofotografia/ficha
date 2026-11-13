export type DieValue = '' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12';

export const DICE_OPTIONS: Exclude<DieValue, ''>[] = ['d4', 'd6', 'd8', 'd10', 'd12'];

export type SkillKey =
  | 'acrobacia'
  | 'atletismo'
  | 'blefe'
  | 'cienciaEstr'
  | 'conhecBio'
  | 'conhecNatur'
  | 'cultura'
  | 'diplomacia'
  | 'empatia'
  | 'engenharia'
  | 'furtividade'
  | 'intimidacao'
  | 'medicina'
  | 'misticismo'
  | 'montaria'
  | 'percepcao'
  | 'prestidigitacao'
  | 'profissao'
  | 'sobrevivencia';

export interface SkillDefinition {
  key: SkillKey;
  label: string;
}

export const SKILLS_LIST: SkillDefinition[] = [
  { key: 'acrobacia', label: 'Acrobacia' },
  { key: 'atletismo', label: 'Atletismo' },
  { key: 'blefe', label: 'Blefe' },
  { key: 'cienciaEstr', label: 'Ciencia estr.' },
  { key: 'conhecBio', label: 'Conhec. Bio.' },
  { key: 'conhecNatur', label: 'Conhec. Natur.' },
  { key: 'cultura', label: 'Cultura' },
  { key: 'diplomacia', label: 'Diplomacia' },
  { key: 'empatia', label: 'Empatia' },
  { key: 'engenharia', label: 'Engenharia' },
  { key: 'furtividade', label: 'Furtividade' },
  { key: 'intimidacao', label: 'Intimidação' },
  { key: 'medicina', label: 'Medicina' },
  { key: 'misticismo', label: 'Misticismo' },
  { key: 'montaria', label: 'Montaria' },
  { key: 'percepcao', label: 'Percepção' },
  { key: 'prestidigitacao', label: 'Prestidigitação' },
  { key: 'profissao', label: 'Profissão' },
  { key: 'sobrevivencia', label: 'Sobrevivência' },
];

export type PericiasMap = Record<SkillKey, DieValue>;

export interface CharacterSheetData {
  nome: string;
  nivel: string;
  experienciaAtual: string;
  experienciaTotal: string;
  defesa: string;
  iniciativa: string;
  fadiga: number;
  tambor: string;
  pericias: PericiasMap;
  protecao: string;
  armaCurtaDado: DieValue;
  armaCurtaTexto: string;
  armaLongaDado: DieValue;
  armaLongaTexto: string;
  corpoACorpoDado: DieValue;
  corpoACorpoTexto: string;
  equipamentos: string;
}

export interface CharacterDocument extends CharacterSheetData {
  id: string;
  ownerId: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export const FIELD_LIMITS = {
  idPattern: /^[a-zA-Z0-9_-]+$/,
  tamborPattern: /^[01]{6}$/,
  nome: 100,
  nivel: 30,
  experienciaAtual: 30,
  experienciaTotal: 30,
  defesa: 30,
  iniciativa: 30,
  protecao: 60,
  armaTexto: 120,
  equipamentos: 4000,
} as const;

export function createEmptyPericias(): PericiasMap {
  return {
    acrobacia: '',
    atletismo: '',
    blefe: '',
    cienciaEstr: '',
    conhecBio: '',
    conhecNatur: '',
    cultura: '',
    diplomacia: '',
    empatia: '',
    engenharia: '',
    furtividade: '',
    intimidacao: '',
    medicina: '',
    misticismo: '',
    montaria: '',
    percepcao: '',
    prestidigitacao: '',
    profissao: '',
    sobrevivencia: '',
  };
}

export function createEmptyCharacterSheet(): CharacterSheetData {
  return {
    nome: '',
    nivel: '',
    experienciaAtual: '',
    experienciaTotal: '',
    defesa: '',
    iniciativa: '',
    fadiga: 0,
    tambor: '000000',
    pericias: createEmptyPericias(),
    protecao: '',
    armaCurtaDado: '',
    armaCurtaTexto: '',
    armaLongaDado: '',
    armaLongaTexto: '',
    corpoACorpoDado: '',
    corpoACorpoTexto: '',
    equipamentos: '',
  };
}

function sanitizeDie(val: unknown): DieValue {
  if (val === 'd4' || val === 'd6' || val === 'd8' || val === 'd10' || val === 'd12') {
    return val;
  }
  return '';
}

function sanitizeString(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.slice(0, maxLen);
}

export function sanitizeCharacterSheet(data: CharacterSheetData): CharacterSheetData {
  const emptyPericias = createEmptyPericias();
  const pericias: PericiasMap = { ...emptyPericias };
  for (const skill of SKILLS_LIST) {
    pericias[skill.key] = sanitizeDie(data.pericias?.[skill.key]);
  }

  const fadigaNum = typeof data.fadiga === 'number' && Number.isFinite(data.fadiga)
    ? Math.max(0, Math.min(10, Math.round(data.fadiga)))
    : 0;

  const tamborStr =
    typeof data.tambor === 'string' && FIELD_LIMITS.tamborPattern.test(data.tambor)
      ? data.tambor
      : '000000';

  return {
    nome: sanitizeString(data.nome, FIELD_LIMITS.nome),
    nivel: sanitizeString(data.nivel, FIELD_LIMITS.nivel),
    experienciaAtual: sanitizeString(data.experienciaAtual, FIELD_LIMITS.experienciaAtual),
    experienciaTotal: sanitizeString(data.experienciaTotal, FIELD_LIMITS.experienciaTotal),
    defesa: sanitizeString(data.defesa, FIELD_LIMITS.defesa),
    iniciativa: sanitizeString(data.iniciativa, FIELD_LIMITS.iniciativa),
    fadiga: fadigaNum,
    tambor: tamborStr,
    pericias,
    protecao: sanitizeString(data.protecao, FIELD_LIMITS.protecao),
    armaCurtaDado: sanitizeDie(data.armaCurtaDado),
    armaCurtaTexto: sanitizeString(data.armaCurtaTexto, FIELD_LIMITS.armaTexto),
    armaLongaDado: sanitizeDie(data.armaLongaDado),
    armaLongaTexto: sanitizeString(data.armaLongaTexto, FIELD_LIMITS.armaTexto),
    corpoACorpoDado: sanitizeDie(data.corpoACorpoDado),
    corpoACorpoTexto: sanitizeString(data.corpoACorpoTexto, FIELD_LIMITS.armaTexto),
    equipamentos: sanitizeString(data.equipamentos, FIELD_LIMITS.equipamentos),
  };
}
