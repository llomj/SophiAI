
export enum Persona {
  // 1. INFLUENCES
  HAWKING = 'Stephen Hawking',
  COX = 'Brian Box',
  FEYNMAN = 'Richard Feynman',
  EINSTEIN = 'Albert Einstein',
  PENROSE = 'Roger Penrose',
  TYSON = 'Neil deGrasse Tyson',
  DARWIN = 'Charles Darwin',
  DAWKINS = 'Richard Dawkins',
  PINKER = 'Steven Pinker',
  JUNG = 'Carl Jung',
  PLATO = 'Plato',
  ARISTOTLE = 'Aristotle',
  HUME = 'David Hume',
  RUSSELL = 'Bertrand Russell',
  WITTGENSTEIN = 'Ludwig Wittgenstein',
  HARRIS = 'Sam Harris',
  SAGAN = 'Carl Sagan',
  CHOMSKY = 'Noam Chomsky',
  BOSTROM = 'Nick Bostrom',

  // 2. SCIENTIFIC
  COMPUTATIONALIST = 'Computationalist',
  FUNCTIONALIST = 'Functionalist',
  QUANTUM_FIELD_THEORIST = 'Quantum Field Theorist',
  NEUROBIOLOGIST = 'Neurobiologist',
  ASTROBIOLOGIST = 'Astrobiologist',
  THEORETICAL_PHYSICIST = 'Theoretical Physicist',
  COMPLEXITY_THEORIST = 'Complexity Theorist',
  QUANTUM_PHYSICIST = 'Quantum Physicist',
  RELATIVITY_PHYSICIST = 'Relativity Physicist',
  NEWTONIAN_PHYSICIST = 'Newtonian Physicist',
  SIMULATION_THEORIST = 'Simulation Theorist',
  STRING_THEORIST = 'String Theorist',
  MULTIVERSE_THEORIST = 'Multiverse Theorist',
  MANY_WORLDS_THEORIST = 'Many Worlds Theorist',

  // 3. POLITICAL
  COMMUNITARIAN = 'Communitarian',
  MINARCHIST = 'Minarchist',
  SYNDICALIST = 'Syndicalist',
  NEOLIBERAL = 'Neoliberal',
  DISTRIBUTIST = 'Distributist',
  TECHNOCRAT = 'Technocrat',
  SOCIAL_DEMOCRAT = 'Social Democrat',
  GLOBALIST = 'Globalist',
  GREEN_POLITICS = 'Green Politics',
  NEOCONSERVATIVE = 'Neoconservative',
  MARXIST = 'Marxist',
  OBJECTIVIST = 'Objectivist',
  ANARCHIST = 'Anarchist',

  // 4. ECONOMIC
  CAPITALIST = 'Capitalist',
  LIBERTARIAN = 'Libertarian',
  AUSTRIAN = 'Austrian Economist',
  KEYNESIAN = 'Keynesian',
  INSTITUTIONAL_ECONOMIST = 'Institutional Economist',
  POST_KEYNESIAN = 'Post-Keynesian',
  ECOLOGICAL_ECONOMIST = 'Ecological Economist',
  CLASSICAL_ECONOMIST = 'Classical Economist',
  SRAFFIAN = 'Sraffian',
  MMT_THEORIST = 'MMT Theorist',
  MALTHUSIAN = 'Malthusian',
  BEHAVIORAL_ECONOMIST = 'Behavioral Economist',
  MERCANTILIST = 'Mercantilist',
  PHYSIOCRAT = 'Physiocrat',
  GEORGIST = 'Georgist',
  MUTUALIST = 'Mutualist',

  // 5. BIOLOGICAL
  ETHOLOGIST = 'Ethologist',
  MOLECULAR_BIOLOGIST = 'Molecular Biologist',
  EVOLUTIONARY_PSYCHOLOGIST = 'Evolutionary Psychologist',
  SYSTEMS_BIOLOGIST = 'Systems Biologist',
  PALEONTOLOGIST = 'Paleontologist',
  NEO_DARWINIST = 'Neo-Darwinist',
  LAMARCKIST = 'Lamarckist',
  SOCIOBIOLOGIST = 'Sociobiologist',
  GAIA_THEORIST = 'Gaia Theorist',
  EPIGENETICIST = 'EpigenETICist',
  DARWINIST = 'Darwinist',

  // 6. MODERN & POST-MODERN
  MODERNIST = 'Modernist',
  POST_MODERNIST = 'Post-Modernist',
  NIHILIST = 'Nihilist',
  EXISTENTIALIST = 'Existentialist',
  ABSURDIST = 'Absurdist',
  SOLIPSIST = 'Solipsist',
  ANALYTIC = 'Analytic Matrix',

  // 7. THEOLOGICAL
  ATHEIST = 'Atheist',
  THEIST = 'Theist',
  CHRISTIAN = 'Christian',
  MUSLIM = 'Muslim',
  JEWISH = 'Jewish',
  CREATIONIST = 'Creationist',
  PANPSYIST = 'Panpsyist',

  // 8. ARTS & AESTHETIC
  SURREALIST = 'Surrealist',
  FUTURIST = 'Futurist',
  DADAIST = 'Dadaist',
  MINIMALIST = 'Minimalist',
  POP_ARTIST = 'Pop Artist',
  CONCEPTUALIST = 'Conceptualist',
  FORMALIST = 'Formalist',
  INSTITUTIONALIST = 'Institutionalist',
  ROMANTICIST = 'Romanticist',
  REALIST = 'Realist',

  // 9. CLASSIC
  STOIC = 'Stoic',
  SOCRATIC = 'Socratic',
  EPICUREAN = 'Epicurean',
  CYNIC = 'Cynic',
  SCHOLASTIC = 'Scholastic',
  VIRTUE_ETHICIST = 'Virtue Ethicist',

  // 10. EASTERN
  TAOIST = 'Taoist',
  BUDDHIST = 'Buddhist',
  HINDU = 'Hindu',
  NON_DUALIST = 'Non-Dualist',
  LEGALIST = 'Legalist',

  // 11. EXPERIMENTAL & FRINGE
  TJUMP = 'TJump',
  ACCELERATIONIST = 'Accelerationist',
  TRANSHUMANIST = 'Transhumanist',
  FLAT_EARTHER = 'Flat Earther',
  ANCIENT_ALIEN_THEORIST = 'Ancient Alien Theorist',
  SHADOW_GOV_THEORIST = 'Shadow Gov Theorist'
}

export interface Fallacy {
  name: string;
  definition: string;
  example: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  persona?: string; // Which persona sent this message (for multi-persona chats)
  metadata?: {
    contradictionDetected?: boolean;
    epistemicWarning?: string;
    fallacies?: Fallacy[];
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  tags: string[];
  persona: string; // Primary persona (for backward compatibility)
  personas?: string[]; // Multiple active personas for multi-persona mode
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

export interface CustomPersona {
  id: string;
  name: string;
  description: string;
  instruction: string;
  color: string;
  createdAt: number;
}

export interface SophiData {
  conversations: Conversation[];
  concepts: Concept[];
  notes: Note[];
  currentConversationId: string | null;
  activePersona: string;
  activeContextNoteId: string | null;
  personaAugmentations: Partial<Record<string, string>>;
  userPersonality: string;
  userPrompt: string;
  userLog?: string;
  customPersonas: CustomPersona[];
  emojiMode: boolean;
}
