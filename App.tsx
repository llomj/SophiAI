import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Persona, Conversation, Message, SophiData, Note, Concept, CustomPersona } from './types';
import { loadSophiData, saveSophiData, exportToCSV, saveApiKey, loadApiKey } from './utils/storage';
import { getPhilosophicalResponse, getPersonaDNA } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ConceptMap from './components/ConceptGraph';

const App: React.FC = () => {
  // BOOTSTRAP STATE: Start empty to allow the splash screen to render immediately
  const [archive, setArchive] = useState<SophiData | null>(null);
  
  // FAST UI STATE: Handles navigation and immediate feedback
  const [activePersona, setActivePersona] = useState<string>(Persona.TJUMP);
  const [activePersonas, setActivePersonas] = useState<string[]>([Persona.TJUMP]); // Multi-persona support
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'graph' | 'notes' | 'forge' | 'userlog' | 'userprompt' | 'customise'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [newPersona, setNewPersona] = useState({ name: '', description: '', instruction: '' });

  // 1. ASYNCHRONOUS INITIALIZATION
  // Move heavy JSON parsing and memory allocation out of the main thread boot
  useEffect(() => {
    const initTimer = setTimeout(() => {
      const loadedData = loadSophiData();
      setArchive(loadedData);
      setActivePersona(loadedData.activePersona);
      setCurrentConversationId(loadedData.currentConversationId);
      
      // Load saved API key if it exists
      const savedApiKey = loadApiKey();
      if (savedApiKey) {
        setApiKeyInput(savedApiKey);
      } else {
        // Check if environment variable is available (dev only)
        const envKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        if (!envKey || envKey === 'null' || envKey === 'undefined') {
          // No API key found - auto-open modal after a short delay
          setTimeout(() => {
            setIsApiKeyModalOpen(true);
          }, 1000);
        }
      }
      
      // Delay finishing the loading animation to let the browser breathe
      setTimeout(() => setIsInitializing(false), 300);
    }, 100);
    return () => clearTimeout(initTimer);
  }, []);

  // Handle API key save
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      setIsApiKeyModalOpen(false);
      // Force page reload to apply new API key
      window.location.reload();
    }
  };

  const handleClearApiKey = () => {
    setApiKeyInput('');
    saveApiKey('');
    setIsApiKeyModalOpen(false);
  };

  // 2. IDLE-TIME PERSISTENCE
  // Decoupled saving from the interaction loop
  const saveTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (!archive) return;
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = window.setTimeout(() => {
      saveSophiData({ ...archive, activePersona, currentConversationId });
    }, 5000); // 5 second buffer for heavy mobile stability
    
    return () => { if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current); };
  }, [archive, activePersona, currentConversationId]);

  const activeConversation = useMemo(() => {
    if (!archive) return null;
    const conv = archive.conversations.find(c => c.id === currentConversationId);
    if (conv) {
      // Update activePersonas from conversation if it has multiple personas
      if (conv.personas && conv.personas.length > 0) {
        setActivePersonas(conv.personas);
      } else {
        // For backward compatibility, use single persona
        setActivePersonas([conv.persona || activePersona]);
      }
    }
    return conv || null;
  }, [archive, currentConversationId]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!archive) return;
    
    let currentId = currentConversationId;
    let updatedConversations = [...archive.conversations];

    if (!currentId) {
      currentId = crypto.randomUUID();
      const newConv: Conversation = {
        id: currentId,
        title: text.slice(0, 15).toUpperCase() + '...',
        messages: [],
        tags: [],
        persona: activePersonas[0] || activePersona, // Primary persona for backward compatibility
        personas: activePersonas.length > 0 ? activePersonas : [activePersona], // Multi-persona support
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      updatedConversations = [newConv, ...updatedConversations];
      setCurrentConversationId(currentId);
    } else {
      // Update conversation with current active personas
      updatedConversations = updatedConversations.map(c => 
        c.id === currentId ? { ...c, personas: activePersonas.length > 0 ? activePersonas : [activePersona] } : c
      );
    }

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() };

    // Update the conversation locally to include the user message before API call
    const currentConv = updatedConversations.find(c => c.id === currentId);
    const messagesWithUser = currentConv ? [...currentConv.messages, userMessage] : [userMessage];
    
    // Update the local conversations array
    updatedConversations = updatedConversations.map(c => 
      c.id === currentId ? { ...c, messages: messagesWithUser, updatedAt: Date.now() } : c
    );

    setArchive(prev => {
      if (!prev) return null;
      return {
        ...prev,
        conversations: updatedConversations
      };
    });

    setIsLoading(true);
    try {
      const { text: responseText, contradictionDetected, fallacies } = await getPhilosophicalResponse(
        activePersona, 
        messagesWithUser, 
        text, 
        archive.notes.find(n => n.id === archive.activeContextNoteId)?.content,
        archive.personaAugmentations[activePersona],
        archive.userPrompt,
        archive.conversations,
        archive.customPersonas,
        archive.emojiMode
      );

      // Get list of personas to respond (use conversation's personas or activePersonas)
      const currentConv = updatedConversations.find(c => c.id === currentId);
      const personasToRespond = currentConv?.personas && currentConv.personas.length > 0 
        ? currentConv.personas 
        : (activePersonas.length > 0 ? activePersonas : [activePersona]);

      // Call API for each persona in parallel
      const responsePromises = personasToRespond.map(persona =>
        getPhilosophicalResponse(
          persona,
          messagesWithUser,
          text,
          archive.notes.find(n => n.id === archive.activeContextNoteId)?.content,
          archive.personaAugmentations[persona],
          archive.userPrompt,
          archive.conversations,
          archive.customPersonas,
          archive.emojiMode
        ).then(response => ({ persona, ...response }))
      );

      const responses = await Promise.all(responsePromises);

      // Create assistant messages for each persona response
      const assistantMessages: Message[] = responses.map(({ persona, text: responseText, contradictionDetected, fallacies }) => ({
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: responseText,
        timestamp: Date.now(),
        persona: persona, // Track which persona sent this message
        metadata: { contradictionDetected, fallacies }
      }));

      setArchive(prev => {
        if (!prev) return null;
        return {
          ...prev,
          conversations: prev.conversations.map(c => 
            c.id === currentId 
              ? { 
                  ...c, 
                  messages: [...c.messages, ...assistantMessages], 
                  updatedAt: Date.now(),
                  personas: personasToRespond // Save active personas to conversation
                } 
              : c
          )
        };
      });
    } catch (e) {
      console.error("Neural Connection Severed:", e);
      // Show error message to user
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${e instanceof Error ? e.message : 'Communication with the reasoning matrix failed.'}`,
        timestamp: Date.now(),
        metadata: { contradictionDetected: false, fallacies: [] }
      };
      setArchive(prev => {
        if (!prev) return null;
        return {
          ...prev,
          conversations: prev.conversations.map(c => 
            c.id === currentId ? { ...c, messages: [...c.messages, errorMessage], updatedAt: Date.now() } : c
          )
        };
      });
    } finally {
      setIsLoading(false);
    }
  }, [activePersona, activePersonas, currentConversationId, archive]);

  const handlePersonaChange = (p: string) => {
    console.log('handlePersonaChange called with:', p); // Debug log
    if (!p || typeof p !== 'string') {
      console.error('Invalid persona in handlePersonaChange:', p);
      return;
    }
    setActivePersona(p);
    // Add persona to activePersonas if not already present (multi-persona support)
    setActivePersonas(prev => {
      if (prev.includes(p)) {
        // If already in list, make it the first one (primary)
        return [p, ...prev.filter(persona => persona !== p)];
      } else {
        // Add to list
        return [p, ...prev];
      }
    });
    if (!currentConversationId || activeConversation?.persona !== p) {
      setCurrentConversationId(null);
    }
  };

  const addCustomPersona = () => {
    if (!newPersona.name || !newPersona.instruction || !archive) return;
    const persona: CustomPersona = {
      id: crypto.randomUUID(),
      ...newPersona,
      color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      createdAt: Date.now()
    };
    setArchive(prev => prev ? ({ ...prev, customPersonas: [persona, ...prev.customPersonas] }) : null);
    setActivePersona(persona.name);
    setNewPersona({ name: '', description: '', instruction: '' });
    setActiveTab('chat');
  };

  // IMMEDIATE FEEDBACK LOADING SCREEN
  if (isInitializing || !archive) {
    return (
      <div className="h-screen w-full bg-[#05060b] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <div className="mono text-cyan-500 text-[10px] uppercase tracking-[0.8em] animate-pulse">SOPHIAI_DNA_HYDRATION</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#05060b] text-slate-300 overflow-hidden overflow-x-hidden relative font-sans touch-none lg:touch-auto" style={{ maxWidth: '100%', width: '100%', height: '-webkit-fill-available', overflowX: 'hidden', position: 'fixed', left: 0, right: 0, top: 0 }}>
      {isHelpOpen && (
        <div className="fixed inset-0 z-[150] bg-black/95 p-4 lg:p-6 flex items-center justify-center animate-in fade-in" onClick={(e) => {
          if (e.target === e.currentTarget) setIsHelpOpen(false);
        }}>
           <div className="max-w-4xl w-full max-h-[90vh] bg-[#0a0b10] border border-cyan-500/20 rounded-sm shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-800 bg-black/40 flex items-center justify-between">
                <div>
                  <h2 className="mono text-cyan-400 font-bold uppercase tracking-widest text-lg">System Information Protocol</h2>
                  <p className="text-xs text-slate-500 mono uppercase tracking-wider mt-1">Function Documentation & Usage Guide</p>
                </div>
                <button onClick={() => setIsHelpOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* CHAT */}
                <div className="space-y-3 border-l-4 border-cyan-500/50 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <div>
                      <h3 className="mono text-cyan-400 font-bold uppercase tracking-widest text-base">CHAT</h3>
                      <p className="text-xs text-slate-400 mono uppercase tracking-tight">Dialogue Terminal</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-300 leading-relaxed serif">
                      The primary interface for engaging with philosophical AI matrices. Conduct deep dialectical exchanges with various philosophical personas, from Stoic sages to quantum physicists.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                      <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">Use Cases:</p>
                      <ul className="text-xs text-slate-400 space-y-1.5 ml-4 list-disc serif">
                        <li>Engage in Socratic dialogues to explore ethical dilemmas</li>
                        <li>Debate metaphysical questions with different philosophical frameworks</li>
                        <li>Get explanations of complex philosophical concepts</li>
                        <li>Test logical arguments and identify fallacies</li>
                        <li>Explore thought experiments and counterfactuals</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                      <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">How To Use:</p>
                      <ol className="text-xs text-slate-400 space-y-1.5 ml-4 list-decimal serif">
                        <li>Select a matrix persona from the sidebar (TJump, Stoic, etc.)</li>
                        <li>Type your question or statement in the "SEND_INPUT..." field</li>
                        <li>Press Enter (double arrow) or click the send button to submit</li>
                        <li>View responses with highlighted logical fallacies or inconsistencies</li>
                        <li>Click the speaker icon next to messages for text-to-speech</li>
                        <li>Use the microphone icon for voice input</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* MAP */}
                <div className="space-y-3 border-l-4 border-cyan-500/50 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    </div>
                    <div>
                      <h3 className="mono text-cyan-400 font-bold uppercase tracking-widest text-base">MAP</h3>
                      <p className="text-xs text-slate-400 mono uppercase tracking-tight">Conversation Landscape</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-300 leading-relaxed serif">
                      Visualize your conversation archive in a NotebookLM-style map. Navigate through all your dialogues, see relationships between concepts, and quickly resume any previous conversation thread.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                      <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">Use Cases:</p>
                      <ul className="text-xs text-slate-400 space-y-1.5 ml-4 list-disc serif">
                        <li>Browse all your past philosophical conversations</li>
                        <li>Find specific discussions by topic or concept</li>
                        <li>Resume interrupted dialogues seamlessly</li>
                        <li>View concept connections and relationships</li>
                        <li>Understand the evolution of ideas across sessions</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                      <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">How To Use:</p>
                      <ol className="text-xs text-slate-400 space-y-1.5 ml-4 list-decimal serif">
                        <li>Click the "map" tab in the header navigation</li>
                        <li>View conversation cards in a grid layout</li>
                        <li>Each card shows: title, message count, date, and matrix persona</li>
                        <li>Click any conversation card to resume that dialogue</li>
                        <li>Concepts are displayed below conversations if available</li>
                        <li>Use the sidebar to filter by concept categories</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* FORGE */}
                <div className="space-y-3 border-l-4 border-cyan-500/50 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    </div>
                    <div>
                      <h3 className="mono text-cyan-400 font-bold uppercase tracking-widest text-base">FORGE</h3>
                      <p className="text-xs text-slate-400 mono uppercase tracking-tight">Matrix DNA Editor</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-300 leading-relaxed serif">
                      Customize and augment the core behavior of any matrix persona. Modify the underlying logical framework, add specific instructions, or create hybrid philosophical approaches by editing the Matrix DNA directly.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                      <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">Use Cases:</p>
                      <ul className="text-xs text-slate-400 space-y-1.5 ml-4 list-disc serif">
                        <li>Fine-tune a persona's reasoning style or focus areas</li>
                        <li>Add domain-specific knowledge or constraints</li>
                        <li>Create hybrid philosophical frameworks</li>
                        <li>Override default behaviors for specific scenarios</li>
                        <li>Experiment with different logical systems</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                      <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">How To Use:</p>
                      <ol className="text-xs text-slate-400 space-y-1.5 ml-4 list-decimal serif">
                        <li>Select the matrix persona you want to modify from the sidebar</li>
                        <li>Click the "forge" tab in the header</li>
                        <li>The editor shows: "Logic_Forge: [PersonaName]"</li>
                        <li>Type your custom instructions or augmentations</li>
                        <li>Changes are saved automatically and applied to all future conversations</li>
                        <li>Your augmentations are combined with the base Matrix DNA</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* NOTES */}
                <div className="space-y-3 border-l-4 border-cyan-500/50 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <h3 className="mono text-cyan-400 font-bold uppercase tracking-widest text-base">NOTES</h3>
                      <p className="text-xs text-slate-400 mono uppercase tracking-tight">Knowledge Repository</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-300 leading-relaxed serif">
                      Capture insights, summaries, and key ideas from your conversations. Notes can be linked to specific conversations or concepts, creating a persistent knowledge base that enhances future dialogues.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                      <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">Use Cases:</p>
                      <ul className="text-xs text-slate-400 space-y-1.5 ml-4 list-disc serif">
                        <li>Save important insights from conversations</li>
                        <li>Create summaries of complex philosophical arguments</li>
                        <li>Build a personal knowledge base over time</li>
                        <li>Link notes to specific conversations for context</li>
                        <li>Review and refine your understanding of concepts</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                      <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">How To Use:</p>
                      <ol className="text-xs text-slate-400 space-y-1.5 ml-4 list-decimal serif">
                        <li>Click the "notes" tab in the header navigation</li>
                        <li>Create new notes by clicking the "+" button</li>
                        <li>Write your notes with markdown support</li>
                        <li>Link notes to conversations for context (if available)</li>
                        <li>Notes are automatically saved and can be referenced in future chats</li>
                        <li>Search through notes using the search functionality</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-800 bg-black/40 flex justify-end">
                <button onClick={() => setIsHelpOpen(false)} className="px-6 py-3 bg-cyan-500 text-slate-950 mono text-xs font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  Close
                </button>
              </div>
           </div>
        </div>
      )}

      {/* API Key Configuration Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/95 p-4 lg:p-6 flex items-center justify-center animate-in fade-in" onClick={(e) => {
          if (e.target === e.currentTarget) setIsApiKeyModalOpen(false);
        }}>
          <div className="max-w-2xl w-full max-h-[90vh] bg-[#0a0b10] border border-cyan-500/20 rounded-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 bg-black/40 flex items-center justify-between">
              <div>
                <h2 className="mono text-cyan-400 font-bold uppercase tracking-widest text-lg">API Key Configuration</h2>
                <p className="text-xs text-slate-500 mono uppercase tracking-wider mt-1">Google Gemini API Access</p>
              </div>
              <button onClick={() => setIsApiKeyModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mono text-cyan-400 uppercase tracking-wider font-bold mb-2">
                    Your Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter your API key here..."
                    className="w-full px-4 py-3 bg-[#05060b] border border-slate-800 rounded-sm text-sm mono text-slate-200 focus:outline-none focus:border-cyan-500/50 placeholder-slate-600"
                  />
                  <p className="text-xs text-slate-500 mt-2 serif italic">
                    Your API key is stored locally and never shared. Get your key from{' '}
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm space-y-2">
                  <p className="text-xs mono text-cyan-400 uppercase tracking-wider font-bold">Why Set Your Own API Key?</p>
                  <ul className="text-xs text-slate-400 space-y-1.5 ml-4 list-disc serif">
                    <li>Higher rate limits and better performance</li>
                    <li>Personal quota control and usage tracking</li>
                    <li>Enhanced security and privacy</li>
                    <li>Access to latest Gemini models and features</li>
                  </ul>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-sm">
                  <p className="text-xs mono text-amber-400 uppercase tracking-wider font-bold mb-2">⚠️ Security Note</p>
                  <p className="text-xs text-slate-400 serif">
                    Your API key is stored in your browser's local storage. Never share your API key publicly or commit it to version control. If you suspect your key has been compromised, revoke it immediately in Google AI Studio and generate a new one.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-black/40 flex justify-between items-center">
              <button 
                onClick={handleClearApiKey}
                className="px-4 py-2 text-slate-400 hover:text-red-400 mono text-xs uppercase tracking-widest transition-colors"
              >
                Clear Key
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsApiKeyModalOpen(false)} 
                  className="px-6 py-2 border border-slate-700 text-slate-300 mono text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveApiKey}
                  disabled={!apiKeyInput.trim()}
                  className="px-6 py-2 bg-cyan-500 text-slate-950 mono text-xs font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Save & Reload
                </button>
              </div>
            </div>
           </div>
        </div>
      )}

      <Sidebar 
        conversations={archive.conversations}
        activeId={currentConversationId}
        onSelect={(id) => { setCurrentConversationId(id); setActiveTab('chat'); }}
        onNew={() => { setCurrentConversationId(null); setActiveTab('chat'); }}
        onSearch={() => {}}
        activePersona={activePersona}
        onPersonaChange={handlePersonaChange}
        onExport={() => exportToCSV(archive.conversations, 'sophi_backup.csv')}
        onOpenUserLog={() => setActiveTab('userlog')}
        onOpenUserPrompt={() => setActiveTab('userprompt')}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        customPersonas={archive.customPersonas}
        onAddCustomPersona={() => setActiveTab('customise')}
        onDeleteCustomPersona={(id) => setArchive(prev => prev ? ({...prev, customPersonas: prev.customPersonas.filter(p => p.id !== id)}) : null)}
        emojiMode={archive.emojiMode}
        onToggleEmojis={() => setArchive(prev => prev ? ({...prev, emojiMode: !prev.emojiMode}) : null)}
        onToggleHelp={() => setIsHelpOpen(true)}
        onToggleApiKey={() => {
          const savedApiKey = loadApiKey();
          setApiKeyInput(savedApiKey || '');
          setIsApiKeyModalOpen(true);
        }}
        onLaunchDialectic={(t, p) => { setActivePersona(p); setCurrentConversationId(null); setActiveTab('chat'); }}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full bg-[#05060b] overflow-x-hidden">
        {/* API Key Warning Banner */}
        {(() => {
          const userApiKey = loadApiKey();
          const envKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
          const hasApiKey = userApiKey || (envKey && envKey !== 'null' && envKey !== 'undefined');
          
          if (!hasApiKey && !isApiKeyModalOpen) {
            return (
              <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mono text-amber-400 font-bold uppercase tracking-wider">
                      API Key Required
                    </p>
                    <p className="text-xs text-slate-400 serif mt-1">
                      Set your Google Gemini API key to start chatting. Click the 🔑 icon in the sidebar.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setApiKeyInput('');
                    setIsApiKeyModalOpen(true);
                  }}
                  className="ml-4 px-4 py-2 bg-amber-500 text-slate-950 mono text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-all rounded-sm shrink-0"
                >
                  Set Key
                </button>
              </div>
            );
          }
          return null;
        })()}
        <header className="pt-[env(safe-area-inset-top)] border-b border-slate-800 bg-[#0a0b10]/90 z-40 shrink-0">
          <div className="h-14 px-4 flex items-center overflow-x-hidden no-scrollbar space-x-2 flex-wrap" style={{ maxWidth: '100%', width: '100%' }}>
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-cyan-500 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {['chat', 'graph', 'forge', 'notes', 'customise'].map(t => {
              const displayText = t === 'graph' ? 'map' : t;
              return (
                <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-3 text-base lg:text-lg mono uppercase font-bold shrink-0 border-b-2 transition-all ${activeTab === t ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>
                  {displayText}
              </button>
              );
            })}
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden overflow-x-hidden">
          {activeTab === 'chat' && (
            <ChatWindow 
              messages={activeConversation?.messages || []}
              activePersona={activePersona}
              activePersonas={activePersonas}
              onPersonasChange={setActivePersonas}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onOpenSidebar={() => setIsSidebarOpen(true)}
              customPersonas={archive.customPersonas}
            />
          )}

          {activeTab === 'customise' && (
            <div className="h-full overflow-y-auto p-4 lg:p-12 space-y-6 max-w-2xl mx-auto custom-scrollbar animate-in slide-in-from-bottom-2">
              <div className="bg-[#0a0b10] border border-amber-500/20 p-8 rounded-sm space-y-6">
                <h2 className="text-amber-500 mono font-bold uppercase tracking-widest text-base">New_Identity_Sequencer</h2>
                <div className="space-y-4">
                  <input className="w-full bg-[#05060b] border border-slate-800 p-4 text-xs mono text-slate-100 outline-none focus:border-amber-500 transition-colors" placeholder="MATRIX_NAME" value={newPersona.name} onChange={e => setNewPersona(prev => ({...prev, name: e.target.value.toUpperCase()}))} />
                  <textarea className="w-full bg-[#05060b] border border-slate-800 p-4 text-xs mono text-slate-100 outline-none focus:border-amber-500 h-32 leading-relaxed" placeholder="SYSTEM_DIRECTIVES" value={newPersona.instruction} onChange={e => setNewPersona(prev => ({...prev, instruction: e.target.value}))} />
                </div>
                <button onClick={addCustomPersona} className="w-full py-5 bg-amber-500 text-slate-950 mono text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg">Commit DNA Sequence</button>
              </div>
            </div>
          )}

          {activeTab === 'graph' && <ConceptMap concepts={archive.concepts} conversations={archive.conversations} onConceptClick={() => {}} onResumeConversation={(id) => { setCurrentConversationId(id); setActiveTab('chat'); }} />}
          
          {(activeTab === 'forge' || activeTab === 'userprompt') && (
            <div className="h-full p-4 lg:p-12 animate-in fade-in overflow-y-auto custom-scrollbar">
              {activeTab === 'forge' ? (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Base DNA Profile Section */}
                  <div className="bg-[#0a0b10] border border-slate-800 rounded-sm flex flex-col">
                    <div className="p-4 border-b border-slate-800 mono text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-between">
                      <span>Base_Profile: {activePersona}</span>
                      <span className="text-[8px] text-slate-600">Read-Only</span>
                    </div>
                    <div className="p-6 mono text-xs text-slate-400 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar">
                      {getPersonaDNA(activePersona) || 'No base profile available for this persona.'}
                    </div>
                  </div>

                  {/* User Augmentations Section */}
                  <div className="bg-[#0a0b10] border border-cyan-500/30 rounded-sm flex flex-col">
                    <div className="p-4 border-b border-slate-800 mono text-[10px] text-cyan-400 uppercase tracking-widest">
                      User_Augmentations: {activePersona}
                    </div>
                    <textarea 
                      className="flex-1 min-h-[300px] w-full bg-transparent p-6 mono text-sm text-slate-300 outline-none resize-none leading-relaxed"
                      placeholder="Add your custom augmentations here. These will be combined with the base profile above."
                      value={archive.personaAugmentations[activePersona] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setArchive(prev => {
                          if (!prev) return null;
                          return { ...prev, personaAugmentations: { ...prev.personaAugmentations, [activePersona]: val } };
                        });
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full bg-[#0a0b10] border border-slate-800 rounded-sm flex flex-col">
                  <div className="p-4 border-b border-slate-800 mono text-[10px] text-slate-500 uppercase tracking-widest">
                    User_Identity_Protocol
                  </div>
                  <textarea 
                    className="flex-1 w-full bg-transparent p-6 mono text-sm text-slate-300 outline-none resize-none leading-relaxed"
                    value={archive.userPrompt}
                    onChange={(e) => {
                      const val = e.target.value;
                      setArchive(prev => {
                        if (!prev) return null;
                        return { ...prev, userPrompt: val };
                      });
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
