import { SophiData, Persona } from '../types';
import { USER_IDENTITY_DATA } from '../user_identity_forge/identity';
import { USER_LOG_DATA } from '../user_log_forge/logs';

const STORAGE_KEY = 'sophi_ai_delta_v2';

export const saveSophiData = (data: Partial<SophiData>) => {
  try {
    // Only save the dynamic user data. NEVER save the massive static strings from constants.
    const delta = {
      conversations: data.conversations,
      concepts: data.concepts,
      notes: data.notes,
      currentConversationId: data.currentConversationId,
      activePersona: data.activePersona,
      activeContextNoteId: data.activeContextNoteId,
      personaAugmentations: data.personaAugmentations, // This should only contain USER patches now
      userPrompt: data.userPrompt,
      customPersonas: data.customPersonas,
      emojiMode: data.emojiMode
    };
    
    // Use requestIdleCallback if available to prevent blocking touch interactions
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(delta));
      }, { timeout: 2000 });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(delta));
    }
  } catch (e) {
    console.error("Critical Failure: Persistence error in Neural Matrix.", e);
  }
};

export const loadSophiData = (): SophiData => {
  const defaultData: SophiData = {
    conversations: [],
    concepts: [],
    notes: [],
    currentConversationId: null,
    activePersona: Persona.TJUMP,
    activeContextNoteId: null,
    personaAugmentations: {}, 
    userPersonality: USER_LOG_DATA,
    userPrompt: USER_IDENTITY_DATA,
    customPersonas: [],
    emojiMode: false
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultData, ...parsed };
    }
  } catch (e) {
    console.error("Neural Recall Failed. Resetting to factory defaults.");
  }

  return defaultData;
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

// API Key Management
const API_KEY_STORAGE = 'sophi_ai_api_key';

export const saveApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    console.log('✅ API Key saved successfully');
  } catch (e) {
    console.error('❌ Failed to save API key:', e);
  }
};

export const loadApiKey = (): string | null => {
  try {
    return localStorage.getItem(API_KEY_STORAGE);
  } catch (e) {
    console.error('❌ Failed to load API key:', e);
    return null;
  }
};

export const clearApiKey = (): void => {
  try {
    localStorage.removeItem(API_KEY_STORAGE);
    console.log('✅ API Key cleared');
  } catch (e) {
    console.error('❌ Failed to clear API key:', e);
  }
};
