
export enum Persona {
  STOIC = 'Stoic',
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
  HINDU = 'Hindu',
  NON_DUALIST = 'Non-Dualist',
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
  THEIST = 'Theist',
  CHRISTIAN = 'Christian',
  MUSLIM = 'Muslim',
  JEWISH = 'Jewish',
  MORMON = 'Mormon',
  CREATIONIST = 'Creationist',
  FUNCTIONALIST = 'Functionalist',
  COMPUTATIONALIST = 'Computationalist',
  SIMULATION_THEORIST = 'Simulation Theorist',
  STRING_THEORIST = 'String Theorist',
  MULTIVERSE_THEORIST = 'Multiverse Theorist',
  MANY_WORLDS_THEORIST = 'Many Worlds Theorist',
  QUANTUM_PHYSICIST = 'Quantum Physicist',
  RELATIVITY_PHYSICIST = 'Relativity Physicist',
  NEWTONIAN_PHYSICIST = 'Newtonian Physicist',
  PANPSYCHIST = 'Panpsychist',
  PYTHAGOREAN = 'Pythagorean',
  LOGICAL_POSITIVIST = 'Logical Positivist',
  TJUMP = 'TJump',
  CAPITALIST = 'Capitalist',
  SOCIALIST = 'Socialist',
  COMMUNIST = 'Communist',
  LIBERTARIAN = 'Libertarian',
  KEYNESIAN = 'Keynesian',
  AUSTRIAN = 'Austrian Economist',
  GEORGIST = 'Georgist',
  MUTUALIST = 'Mutualist',
  DARWINIST = 'Darwinist',
  NEO_DARWINIST = 'Neo-Darwinist',
  LAMARCKIST = 'Lamarckist',
  GAIA_THEORIST = 'Gaia Theorist',
  SOCIOBIOLOGIST = 'Sociobiologist',
  EPIGENETICIST = 'EpigenETICist',
  VITALIST = 'Vitalist',
  MATERIALIST = 'Materialist',
  PHYSICALIST = 'Physicalist',
  IDEALIST = 'Idealist',
  DUALIST = 'Dualist',
  FOUNDATIONALIST = 'Foundationalist',
  SKEPTIC = 'Skeptic',
  RATIONALIST = 'Rationalist',
  EMPIRICIST = 'Empiricist',
  SOLIPSIST = 'Solipsist',
  FLAT_EARTHER = 'Flat Earther',
  ANCIENT_ALIEN_THEORIST = 'Ancient Alien Theorist',
  SHADOW_GOV_THEORIST = 'Shadow Gov Theorist',
  ACCELERATIONIST = 'Accelerationist',
  ANARCHIST = 'Anarchist',
  TECHNOCRAT = 'Technocrat',
  MODERNIST = 'Modernist',
  POST_MODERNIST = 'Post-Modernist',
  ROMANTICIST = 'Romanticist',
  REALIST = 'Realist',
  SURREALIST = 'Surrealist',
  FUTURIST = 'Futurist',
  DADAIST = 'Dadaist',
  MINIMALIST = 'Minimalist',
  POP_ARTIST = 'Pop Artist',
  CONCEPTUALIST = 'Conceptualist',
  FORMALIST = 'Formalist',
  INSTITUTIONALIST = 'Institutionalist'
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
  category?: string;
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
  userPersonality: string;
  userPrompt: string;
}
