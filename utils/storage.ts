import { SophiData, Persona } from '../types';
import { TJUMP_DATA } from '../persona_forge/tjump';
import { USER_IDENTITY_DATA } from '../user_identity_forge/identity';
import { USER_LOG_DATA } from '../user_log_forge/logs';

const STORAGE_KEY = 'sophi_ai_data_v1';

export const saveSophiData = (data: SophiData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadSophiData = (): SophiData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      personaAugmentations: {
        ...parsed.personaAugmentations,
        [Persona.TJUMP]: parsed.personaAugmentations?.[Persona.TJUMP] || TJUMP_DATA 
      },
      userPersonality: parsed.userPersonality || USER_LOG_DATA,
      userPrompt: parsed.userPrompt || USER_IDENTITY_DATA
    };
  }
  return {
    conversations: [],
    concepts: [],
    notes: [],
    currentConversationId: null,
    activePersona: Persona.STOCIC,
    activeContextNoteId: null,
    personaAugmentations: { 
      [Persona.TJUMP]: TJUMP_DATA 
    },
    userPersonality: USER_LOG_DATA,
    userPrompt: USER_IDENTITY_DATA
  };
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => JSON.stringify(obj[header] || '')).join(','));
  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
