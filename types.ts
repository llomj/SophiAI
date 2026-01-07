
export enum Persona {
  STOCIC = 'Stoic',
  KANTIAN = 'Kantian',
  UTILITARIAN = 'Utilitarian',
  EXISTENTIALIST = 'Existentialist',
  SOCRATIC = 'Socratic',
  NIHILIST = 'Nihilist',
  HEGELIAN = 'Hegelian',
  PRAGMATIST = 'Pragmatist',
  CYNIC = 'Cynic',
  EPICUREAN = 'Epicurean',
  SCHOLASTIC = 'Scholastic',
  MARXIST = 'Marxist',
  PHENOMENOLOGIST = 'Phenomenologist',
  TAOIST = 'Taoist',
  BUDDHIST = 'Buddhist',
  ABSURDIST = 'Absurdist',
  LEGALIST = 'Legalist',
  OBJECTIVIST = 'Objectivist',
  TRANSHUMANIST = 'Transhumanist',
  VIRTUE_ETHICIST = 'Virtue Ethicist',
  CONTRACTARIAN = 'Contractarian',
  POST_STRUCTURALIST = 'Post-Structuralist',
  HERMETICIST = 'Hermeticist',
  ANALYTIC = 'Analytic',
  PROCESS = 'Process',
  TJUMP = 'TJump'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: {
    contradictionDetected?: boolean;
    epistemicWarning?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  tags: string[];
  persona: Persona;
  createdAt: number;
  updatedAt: number;
  pinnedNoteId?: string;
}

export interface Concept {
  id: string;
  label: string;
  description: string;
  importance: number;
  connections: string[]; 
}

export interface Note {
  id: string;
  content: string;
  timestamp: number;
  title?: string;
  linkedConversationId?: string;
  linkedConceptIds?: string[];
  isIngested?: boolean;
}

export interface SophiData {
  conversations: Conversation[];
  concepts: Concept[];
  notes: Note[];
  currentConversationId: string | null;
  activePersona: Persona;
  activeContextNoteId: string | null;
  personaAugmentations: Partial<Record<Persona, string>>;
  userPersonality: string; // Dynamic Log Storage
  userPrompt: string;      // Static Identity Prompt
}
