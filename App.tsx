
import React, { useState, useEffect, useMemo } from 'react';
import { Persona, Conversation, Message, SophiData, Note, Concept, CustomPersona } from './types';
import { loadSophiData, saveSophiData, exportToCSV } from './utils/storage';
import { getPhilosophicalResponse, extractConceptsFromText } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ConceptMap from './components/ConceptGraph';

const TAB_DESCRIPTIONS: Record<string, string> = {
  chat: "TERMINAL: ACTIVE_DIALOGUE_INTERFACE. ENGAGE IN DIALECTIC REASONING WITH SELECTED PHILOSOPHER.",
  forge: "PERSONA_FORGE: KNOWLEDGE_AUGMENTATION. INJECT CUSTOM LOGIC, TRANSCRIPTS, AND AXIOMS INTO THE AI.",
  graph: "MATRIX_MAP: NEURAL_TOPOLOGY. NAVIGATE CATEGORIZED PHILOSOPHICAL NODES EXTRACTED FROM YOUR CONVERSATIONS.",
  notes: "CONTEXT_MATRIX: KNOWLEDGE_VAULT. MANAGE DATA FRAGMENTS TO BE INJECTED INTO AI REASONING PATHS.",
  userprompt: "USER_PROMPT: IDENTITY_DIRECTIVE. DEFINE YOUR STATIC PROFILE AND BEHAVIORAL RULES FOR ALL AI MATRICES.",
  userlog: "USER_LOG: NEURAL_MEMORY. REVIEW CONSOLIDATED HISTORY ACROSS ALL REASONING MATRICES.",
  customise: "CUSTOMISE: ARCHITECT_NEW_REASONING_MATRICES. DEFINE DNA, NAME, AND BEHAVIOR FOR INDIVIDUAL MODELS."
};

const App: React.FC = () => {
  const [data, setData] = useState<SophiData>(() => loadSophiData());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'graph' | 'notes' | 'forge' | 'userlog' | 'userprompt' | 'customise'>('chat');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [copyLabel, setCopyLabel] = useState('COPY');
  const [syncLabel, setSyncLabel] = useState('SYNC');

  // Custom Persona Form State
  const [newPersona, setNewPersona] = useState({ name: '', description: '', instruction: '' });

  useEffect(() => {
    saveSophiData(data);
  }, [data]);

  const activeConversation = useMemo(() => {
    return data.conversations.find(c => c.id === data.currentConversationId) || null;
  }, [data.conversations, data.currentConversationId]);

  const handleSendMessage = async (text: string) => {
    let currentId = data.currentConversationId;
    let updatedConversations = [...data.conversations];

    if (!currentId) {
      currentId = crypto.randomUUID();
      const newConv: Conversation = {
        id: currentId,
        title: text.slice(0, 20).toUpperCase() + '...',
        messages: [],
        tags: [],
        persona: data.activePersona,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      updatedConversations = [newConv, ...updatedConversations];
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setData(prev => ({
      ...prev,
      currentConversationId: currentId,
      conversations: updatedConversations.map(c => 
        c.id === currentId 
          ? { ...c, messages: [...c.messages, userMessage], updatedAt: Date.now() } 
          : c
      )
    }));

    setIsLoading(true);
    const { text: responseText, contradictionDetected } = await getPhilosophicalResponse(
      data.activePersona, 
      updatedConversations.find(c => c.id === currentId)?.messages || [], 
      text, 
      data.notes.find(n => n.id === data.activeContextNoteId)?.content,
      data.personaAugmentations[data.activePersona],
      data.userPrompt,
      data.conversations,
      data.customPersonas
    );

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: responseText,
      timestamp: Date.now(),
      metadata: { contradictionDetected }
    };

    setData(prev => {
      const updatedConvs = prev.conversations.map(c => 
        c.id === currentId 
          ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: Date.now() } 
          : c
      );
      return { ...prev, conversations: updatedConvs };
    });

    setIsLoading(false);

    // Dynamic Concept Extraction
    setTimeout(async () => {
      const convText = text + " " + responseText;
      const extracted = await extractConceptsFromText(convText, data.concepts.map(c => c.label));
      
      if (extracted.length > 0) {
        setData(prev => {
          const newConcepts = [...prev.concepts];
          extracted.forEach(raw => {
            const existingIdx = newConcepts.findIndex(c => c.label.toLowerCase() === raw.label?.toLowerCase());
            if (existingIdx >= 0) {
              if (!newConcepts[existingIdx].connections.includes(currentId!)) {
                newConcepts[existingIdx].connections.push(currentId!);
              }
            } else {
              newConcepts.push({
                id: crypto.randomUUID(),
                label: raw.label!,
                description: raw.description!,
                category: raw.category!,
                importance: raw.importance!,
                connections: [currentId!]
              });
            }
          });
          return { ...prev, concepts: newConcepts };
        });
      }
    }, 1000);
  };

  const addCustomPersona = () => {
    if (!newPersona.name || !newPersona.instruction) {
      alert("IDENTITY LABEL AND DIRECTIVE ARE REQUIRED FOR ARCHIVAL.");
      return;
    }
    const persona: CustomPersona = {
      id: crypto.randomUUID(),
      ...newPersona,
      color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      createdAt: Date.now()
    };
    setData(prev => ({ 
      ...prev, 
      customPersonas: [persona, ...prev.customPersonas],
      activePersona: persona.name 
    }));
    setNewPersona({ name: '', description: '', instruction: '' });
    setActiveTab('chat');
  };

  const deleteCustomPersona = (id: string) => {
    setData(prev => {
      const pToDelete = prev.customPersonas.find(cp => cp.id === id);
      const isCurrentlyActive = pToDelete && prev.activePersona === pToDelete.name;
      
      return { 
        ...prev, 
        customPersonas: prev.customPersonas.filter(p => p.id !== id),
        activePersona: isCurrentlyActive ? Persona.STOIC : prev.activePersona 
      };
    });
  };

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'NEW_FRAGMENT',
      content: '',
      timestamp: Date.now()
    };
    setData(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, ...updates } : n)
    }));
  };

  const deleteNote = (id: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id),
      activeContextNoteId: prev.activeContextNoteId === id ? null : prev.activeContextNoteId
    }));
  };

  const toggleNoteContext = (id: string) => {
    setData(prev => ({
      ...prev,
      activeContextNoteId: prev.activeContextNoteId === id ? null : id
    }));
  };

  const triggerManualSync = () => {
    setSyncLabel('SYNCING...');
    saveSophiData(data);
    setTimeout(() => {
      setSyncLabel('SYNCED!');
      setTimeout(() => setSyncLabel('SYNC'), 2000);
    }, 800);
  };

  const copyToClipboard = () => {
    const text = (activeTab === 'forge' ? data.personaAugmentations[data.activePersona] : data.userPrompt) || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('COPIED!');
      setTimeout(() => setCopyLabel('COPY'), 2000);
    });
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="flex h-screen w-full bg-[#05060b] text-slate-300 overflow-hidden relative">
      <Sidebar 
        conversations={data.conversations}
        activeId={data.currentConversationId}
        onSelect={(id) => setData(prev => ({ ...prev, currentConversationId: id }))}
        onNew={() => {
           const id = crypto.randomUUID();
           setData(prev => ({
             ...prev,
             currentConversationId: id,
             conversations: [{ id, title: 'NEW_LOG', messages: [], tags: [], persona: prev.activePersona, createdAt: Date.now(), updatedAt: Date.now() }, ...prev.conversations]
           }));
           setActiveTab('chat');
        }}
        onSearch={() => {}}
        activePersona={data.activePersona}
        onPersonaChange={(p) => setData(prev => ({ ...prev, activePersona: p }))}
        onExport={() => exportToCSV(data.conversations, 'sophi_logs.csv')}
        onOpenUserLog={() => setActiveTab('userlog')}
        onOpenUserPrompt={() => setActiveTab('userprompt')}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        customPersonas={data.customPersonas}
        onAddCustomPersona={() => setActiveTab('customise')}
        onDeleteCustomPersona={deleteCustomPersona}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-[#05060b]">
        <header className="pt-[env(safe-area-inset-top)] border-b border-slate-800 bg-[#0a0b10]/95 backdrop-blur-xl z-40 shrink-0 relative">
          <div className="h-14 lg:h-16 px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-6 h-full overflow-x-auto no-scrollbar scroll-smooth w-full">
              {['chat', 'forge', 'graph', 'notes', 'customise'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  onMouseEnter={() => setHoveredTab(t)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`h-full px-4 text-[10px] mono uppercase tracking-[0.2em] border-b-2 transition-all shrink-0 font-bold ${activeTab === t ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-600 hover:text-slate-400'}`}
                >
                  {t === 'graph' ? 'map' : t}
                </button>
              ))}
            </div>
          </div>
          {hoveredTab && (
            <div className="absolute top-full left-0 right-0 py-2 border-b border-slate-800 bg-black/95 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-[9px] mono text-cyan-500/80 font-bold tracking-widest px-4 block text-center leading-relaxed whitespace-normal break-words">{TAB_DESCRIPTIONS[hoveredTab]}</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'chat' && (
            <ChatWindow 
              messages={activeConversation?.messages || []}
              activePersona={data.activePersona}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onToggleSidebar={toggleSidebar}
              activeNote={data.notes.find(n => n.id === data.activeContextNoteId)}
              customPersonas={data.customPersonas}
            />
          )}

          {activeTab === 'customise' && (
            <div className="h-full overflow-y-auto custom-scrollbar p-3 lg:p-6 animate-in fade-in">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-[#0a0b10] border border-amber-500/30 p-6 lg:p-10 rounded-sm space-y-8 shadow-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 border border-amber-500/40 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-sm shrink-0">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-amber-400 font-bold mono uppercase tracking-[0.3em] text-lg lg:text-xl">Matrix_Architect</h2>
                      <p className="text-[10px] text-slate-500 mono uppercase tracking-widest">Protocol: DNA_SEQUENCING_V1</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] mono text-slate-500 uppercase font-bold tracking-widest">Identity_Label (Unique ID)</label>
                      <input 
                        className="w-full bg-[#05060b] border border-slate-800 p-4 text-sm text-slate-100 mono focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-800" 
                        placeholder="E.G. NEURAL_SYNAPSE_01"
                        value={newPersona.name}
                        onChange={(e) => setNewPersona(prev => ({...prev, name: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] mono text-slate-500 uppercase font-bold tracking-widest">Role_Description (Short Bio)</label>
                      <input 
                        className="w-full bg-[#05060b] border border-slate-800 p-4 text-sm text-slate-100 mono focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-800" 
                        placeholder="E.G. EXPERIMENTAL REASONING ENGINE"
                        value={newPersona.description}
                        onChange={(e) => setNewPersona(prev => ({...prev, description: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] mono text-slate-500 uppercase font-bold tracking-widest">Behavioral_Directives (System Prompt)</label>
                    <textarea 
                      className="w-full bg-[#05060b] border border-slate-800 p-4 text-sm text-slate-100 mono focus:outline-none focus:border-amber-500 min-h-[180px] leading-relaxed transition-all placeholder:text-slate-800" 
                      placeholder="DEFINE THE UNIQUE LOGICAL CONSTRAINTS, AXIOMS, AND VOICE OF THIS MATRIX..."
                      value={newPersona.instruction}
                      onChange={(e) => setNewPersona(prev => ({...prev, instruction: e.target.value}))}
                    />
                  </div>
                  <button 
                    onClick={addCustomPersona}
                    className="w-full py-6 bg-amber-500 text-slate-950 font-bold mono text-lg uppercase tracking-[0.4em] hover:bg-amber-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-[0.99] border-none"
                  >
                    COMMIT_TO_ACTIVE_ARRAY
                  </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-slate-500 font-bold mono uppercase tracking-[0.3em] text-[10px]">Persistent_Custom_Matrices</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.customPersonas.map(p => (
                      <div key={p.id} className="p-6 border border-slate-800 bg-[#0a0b10] rounded-sm group relative hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-amber-400 font-bold mono uppercase text-base tracking-tighter truncate pr-2">{p.name}</h3>
                            <span className="text-[8px] mono text-slate-700 font-bold uppercase tracking-widest">SEQ_ID_{p.id.slice(0,4)}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mono mb-6 leading-relaxed line-clamp-3 italic opacity-70">"{p.description}"</p>
                        </div>
                        <div className="flex items-center space-x-2 pt-4 border-t border-slate-800/50">
                          <button 
                            onClick={() => { setData(prev => ({...prev, activePersona: p.name})); setActiveTab('chat'); }} 
                            className="flex-1 text-[10px] text-slate-400 hover:text-amber-400 mono font-bold uppercase border border-slate-800 py-2 hover:border-amber-500 transition-all bg-black/20"
                          >
                            RE-INITIALIZE
                          </button>
                        </div>
                      </div>
                    ))}
                    {data.customPersonas.length === 0 && (
                      <div className="col-span-full py-20 text-center border border-dashed border-slate-800/50 bg-black/10 rounded-sm">
                        <div className="mono uppercase text-[10px] tracking-[0.5em] text-slate-700">No_Custom_Matrices_Detected</div>
                        <p className="text-[9px] mono text-slate-800 mt-2">Initialize DNA using the architect panel above.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'forge' || activeTab === 'userprompt') && (
            <div className="h-full flex flex-col p-3 lg:p-6 animate-in fade-in duration-500 relative">
              <div className={`flex-1 flex flex-col w-full max-w-6xl mx-auto bg-[#0a0b10] border rounded-sm overflow-hidden transition-all ${activeTab === 'forge' ? 'border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)]' : 'border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]'}`}>
                <div className="bg-black/40 border-b border-slate-800 p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className={`w-9 h-9 lg:w-11 lg:h-11 border flex items-center justify-center rounded-sm shrink-0 ${activeTab === 'forge' ? 'border-amber-500/40 bg-amber-500/10 text-amber-500' : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-500'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={activeTab === 'forge' ? "M13 10V3L4 14h7v7l9-11h-7z" : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"} /></svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className={`font-bold mono uppercase tracking-[0.2em] lg:tracking-[0.3em] flex items-center mb-1 text-sm lg:text-lg whitespace-nowrap overflow-hidden ${activeTab === 'forge' ? 'text-amber-400' : 'text-cyan-400'}`}>{activeTab === 'forge' ? 'Persona_Forge' : 'User_Identity'}</h2>
                      <p className="text-[9px] lg:text-[10px] text-slate-500 mono flex items-center flex-wrap gap-y-1">
                        <span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-2 shrink-0"></span>
                        {activeTab === 'forge' ? <span className="break-all leading-tight">MOD_SECTOR: <span className="text-amber-500 font-bold ml-1">[{data.activePersona}]</span></span> : <span className="break-all leading-tight">IDENTITY_MATRIX_01</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button onClick={copyToClipboard} className="px-3 lg:px-4 py-2.5 bg-slate-800 text-slate-400 mono text-[10px] uppercase border border-slate-700 hover:text-white hover:bg-slate-700 transition-all flex-1 lg:flex-none font-bold min-w-[80px]">{copyLabel}</button>
                    <button onClick={triggerManualSync} className={`px-4 lg:px-6 py-2.5 mono font-bold text-[10px] uppercase transition-all flex items-center justify-center flex-1 lg:flex-none min-w-[100px] ${activeTab === 'forge' ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}>{syncLabel}</button>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <textarea 
                    className="absolute inset-0 w-full h-full bg-black/30 p-5 lg:p-10 text-[14px] lg:text-base text-slate-300 mono focus:outline-none focus:bg-black/50 transition-all custom-scrollbar resize-none leading-relaxed"
                    value={activeTab === 'forge' ? (data.personaAugmentations[data.activePersona] || '') : data.userPrompt}
                    onChange={(e) => {
                      if (activeTab === 'forge') {
                        setData(prev => ({ ...prev, personaAugmentations: { ...prev.personaAugmentations, [data.activePersona]: e.target.value } }));
                      } else {
                        setData(prev => ({ ...prev, userPrompt: e.target.value }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="h-full flex flex-col p-4 lg:p-6 overflow-hidden bg-[#05060b]">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-cyan-400 font-bold mono uppercase tracking-[0.3em] text-xs lg:text-base">Data_Fragment_Vault</h2>
                <button onClick={createNote} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mono text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all">
                  + ADD_NEW_FRAGMENT
                </button>
              </div>
              <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 custom-scrollbar pb-10">
                {data.notes.map(note => (
                  <div key={note.id} className={`p-5 border flex flex-col transition-all group relative ${data.activeContextNoteId === note.id ? 'bg-cyan-500/5 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-[#0a0b10] border-slate-800 hover:border-slate-600'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <input 
                        className="bg-transparent border-none mono text-[10px] font-bold text-slate-400 focus:outline-none focus:text-white uppercase tracking-widest w-full"
                        value={note.title}
                        onChange={(e) => updateNote(note.id, { title: e.target.value })}
                      />
                      <button onClick={() => deleteNote(note.id)} className="text-slate-600 hover:text-red-500 transition-colors ml-2">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <textarea 
                      className="flex-1 bg-transparent border-none text-xs text-slate-300 italic serif focus:outline-none resize-none leading-relaxed min-h-[100px]"
                      placeholder="ENTER_KNOWLEDGE_FRAGMENT..."
                      value={note.content}
                      onChange={(e) => updateNote(note.id, { content: e.target.value })}
                    />
                    <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                      <button 
                        onClick={() => toggleNoteContext(note.id)}
                        className={`text-[9px] mono font-bold uppercase tracking-tighter transition-all px-2 py-1 rounded-sm border ${data.activeContextNoteId === note.id ? 'bg-cyan-500 text-slate-900 border-cyan-500' : 'text-slate-600 border-slate-800 hover:border-slate-600'}`}
                      >
                        {data.activeContextNoteId === note.id ? 'INJECTED' : 'INJECT_INTO_AI'}
                      </button>
                      <span className="text-[8px] mono text-slate-700">{new Date(note.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {data.notes.length === 0 && (
                  <div className="col-span-full h-full flex flex-col items-center justify-center opacity-20 mono uppercase text-xs tracking-[0.5em] py-32">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 12h14M5 16h14" /></svg>
                    <span>Vault_Empty</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'graph' && (
             <div className="h-full w-full">
               <ConceptMap 
                concepts={data.concepts} 
                conversations={data.conversations}
                onConceptClick={() => {}} 
                onResumeConversation={(id) => {
                  setData(prev => ({ ...prev, currentConversationId: id }));
                  setActiveTab('chat');
                }}
              />
             </div>
          )}
          
          {activeTab === 'userlog' && (
            <div className="h-full overflow-y-auto custom-scrollbar p-4 lg:p-8 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
               <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-8 sticky top-0 bg-[#05060b]/95 backdrop-blur-xl z-20">
                <h2 className="text-cyan-400 font-bold mono uppercase tracking-[0.3em] text-sm lg:text-xl">Neural_Archive_Log</h2>
                <button onClick={() => setActiveTab('chat')} className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 rounded-sm transition-all px-4 lg:px-6 shadow-lg flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <span className="text-[11px] mono font-bold">CLOSE</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.conversations.map(conv => (
                  <div key={conv.id} className="border border-slate-800 bg-[#0a0b10] p-6 lg:p-8 rounded-sm space-y-5 hover:border-cyan-500/40 transition-all flex flex-col group">
                    <div className="flex justify-between items-center shrink-0">
                      <span className="text-[10px] mono text-cyan-500 font-bold uppercase tracking-widest">{conv.persona}</span>
                      <span className="text-[9px] mono text-slate-600 font-bold">{new Date(conv.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-sm lg:text-base font-bold mono text-slate-100 uppercase truncate">{conv.title}</h3>
                    <div className="space-y-3 opacity-60 flex-1">
                      {conv.messages.slice(-2).map(m => (
                        <div key={m.id} className="text-[12px] lg:text-sm font-serif italic border-l-2 border-slate-800 group-hover:border-cyan-900 pl-4 py-2 line-clamp-3">"{m.content}"</div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4 shrink-0">
                      <button onClick={() => { setData(prev => ({ ...prev, currentConversationId: conv.id })); setActiveTab('chat'); }} className="text-[10px] mono text-slate-500 hover:text-cyan-400 uppercase tracking-[0.2em] border border-slate-800 group-hover:border-cyan-500/30 px-5 py-2.5 active:bg-cyan-500 active:text-slate-900 transition-all font-bold">RESUME_THREAD</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
