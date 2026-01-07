
import { SophiData, Persona } from '../types';

const STORAGE_KEY = 'sophi_ai_data_v1';

const TJUMP_INITIAL_DATA = `TJump 50 sources: Justified True Belief (JTB) & Epistemology.
Knowledge is defined as Justified True Belief (JTB). Absolute certainty is not required; fallibilism is the consensus. 
The only absolute truth is the Cogito: 'I think, therefore I am'.
Justification requires Novel Testable Predictions (NTPs). If a claim cannot produce a prediction about the future that is confirmed, it is imaginary claptrap.
Post-hoc explanations (explaining data that already exists) are not evidence.
Consciousness is an emergent property of material states (Composition Fallacy refuted).
Morality is a Descriptive Law of Physics (No inherent 'oughts'). The Best of All Possible Worlds (BAPW) is the absence of involuntary imposition of will.
Authority and commands are irrelevant to morality.`;

export const saveSophiData = (data: SophiData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadSophiData = (): SophiData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      personaAugmentations: parsed.personaAugmentations || { [Persona.TJUMP]: TJUMP_INITIAL_DATA },
      userPersonality: parsed.userPersonality || '',
      userPrompt: parsed.userPrompt || ''
    };
  }
  return {
    conversations: [],
    concepts: [],
    notes: [],
    currentConversationId: null,
    activePersona: Persona.STOCIC,
    activeContextNoteId: null,
    personaAugmentations: { [Persona.TJUMP]: TJUMP_INITIAL_DATA },
    userPersonality: '',
    userPrompt: ''
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
