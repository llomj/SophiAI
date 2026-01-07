
import React, { useState, useEffect, useMemo } from 'react';
import { Persona, Conversation, Message, SophiData, Note } from './types';
import { loadSophiData, saveSophiData, exportToCSV } from './utils/storage';
import { getPhilosophicalResponse, generateThoughtExperiment } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ConceptMap from './components/ConceptGraph'; // Renamed conceptually to Map

const TAB_DESCRIPTIONS: Record<string, string> = {
  chat: "TERMINAL: ACTIVE_DIALOGUE_INTERFACE. ENGAGE IN DIALECTIC REASONING WITH SELECTED PHILOSOPHER.",
  forge: "PERSONA_FORGE: KNOWLEDGE_AUGMENTATION. INJECT CUSTOM LOGIC, TRANSCRIPTS, AND AXIOMS INTO THE AI.",
  graph: "MATRIX_MAP: NEURAL_TOPOLOGY. NAVIGATE CATEGORIZED PHILOSOPHICAL NODES AND THEIR CROSS-CONNECTIONS.",
  notes: "ARCHIVES: DATA_RETENTION_CENTER. BROWSE SAVED NOTES, QUOTES, AND EXTERNAL REFERENCES.",
  userprompt: "USER_PROMPT: IDENTITY_DIRECTIVE. DEFINE YOUR STATIC PROFILE AND BEHAVIORAL RULES FOR ALL AI MATRICES.",
  userlog: "USER_LOG: NEURAL_MEMORY. REVIEW CONSOLIDATED HISTORY ACROSS ALL REASONING MATRICES."
};

const TOOLTIPS: Record<string, string> = {
  sync: "SYNC_LOGIC: NEURAL_COMMIT. ETCHES THE CURRENT BUFFER INTO THE BRAIN OF THE ACTIVE SECTOR PERMANENTLY.",
  status: "STANDBY: MONITORING PHYSICAL SECTORS. 'SAVED' CONFIRMS DATA IS ENCRYPTED AND STORED IN LOCAL_DISK.",
  copy: "BUFFER_CLONE: DUPLICATES THE ENTIRE NEURAL MATRIX TO CLIPBOARD WITHOUT ALTERING LOCAL DATA."
};

const App: React.FC = () => {
  const [data, setData] = useState<SophiData>(() => loadSophiData());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'graph' | 'notes' | 'forge' | 'userlog' | 'userprompt'>('chat');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [controlHover, setControlHover] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      data.conversations
    );

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: responseText,
      timestamp: Date.now(),
      metadata: { contradictionDetected }
    };

    setData(prev => ({
      ...prev,
      conversations: prev.conversations.map(c => 
        c.id === currentId 
          ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: Date.now() } 
          : c
      )
    }));
    setIsLoading(false);
  };

  const triggerManualSync = () => {
    setSaveStatus('SAVING');
    setTimeout(() => {
      setSaveStatus('SAVED');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
    }, 600);
  };

  const copyToClipboard = () => {
    const text = (activeTab === 'forge' ? data.personaAugmentations[data.activePersona] : data.userPrompt) || '';
    navigator.clipboard.writeText(text);
    const btn = document.getElementById('copy-btn');
    if (btn) btn.innerText = 'COPIED!';
    setTimeout(() => { if (btn) btn.innerText = 'COPY_DATA'; }, 2000);
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
      />

      <main className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-[#05060b]">
        {/* Header - Handling top safe area for iPhone notch */}
        <header className="pt-[env(safe-area-inset-top)] border-b border-slate-800 bg-[#0a0b10]/95 backdrop-blur-xl z-40 shrink-0 relative">
          <div className="h-14 lg:h-16 px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-6 h-full overflow-x-auto no-scrollbar scroll-smooth w-full">
              {['chat', 'forge', 'graph', 'notes'].map(t => (
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
              <span className="text-[9px] mono text-cyan-500/80 font-bold tracking-widest px-4 block text-center leading-relaxed whitespace-normal break-words">
                {TAB_DESCRIPTIONS[hoveredTab]}
              </span>
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
            />
          )}

          {(activeTab === 'forge' || activeTab === 'userprompt') && (
            <div className="h-full flex flex-col p-3 lg:p-6 animate-in fade-in duration-500 relative">
              {controlHover && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 mono text-[8px] font-bold py-2 px-5 z-[60] rounded-b-sm border-x border-b shadow-2xl animate-in slide-in-from-top-4 max-w-[85vw] text-center leading-tight ${activeTab === 'forge' ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-cyan-500 text-slate-900 border-cyan-400'}`}>
                  {TOOLTIPS[controlHover]}
                </div>
              )}

              <div className={`flex-1 flex flex-col w-full max-w-6xl mx-auto bg-[#0a0b10] border rounded-sm overflow-hidden transition-all ${activeTab === 'forge' ? 'border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)]' : 'border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]'}`}>
                <div className="bg-black/40 border-b border-slate-800 p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className={`w-9 h-9 lg:w-11 lg:h-11 border flex items-center justify-center rounded-sm shrink-0 ${activeTab === 'forge' ? 'border-amber-500/40 bg-amber-500/10 text-amber-500' : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-500'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={activeTab === 'forge' ? "M13 10V3L4 14h7v7l9-11h-7z" : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"} />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className={`font-bold mono uppercase tracking-[0.2em] lg:tracking-[0.3em] flex items-center mb-1 text-sm lg:text-lg whitespace-nowrap overflow-hidden ${activeTab === 'forge' ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {activeTab === 'forge' ? 'Persona_Forge' : 'User_Identity'}
                      </h2>
                      <p className="text-[9px] lg:text-[10px] text-slate-500 mono flex items-center flex-wrap gap-y-1">
                        <span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-2 shrink-0"></span>
                        {activeTab === 'forge' ? 
                          <span className="break-all leading-tight">MOD_SECTOR: <span className="text-amber-500 font-bold ml-1">[{data.activePersona}]</span></span> : 
                          <span className="break-all leading-tight">IDENTITY_MATRIX_01</span>
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button onClick={copyToClipboard} onMouseEnter={() => setControlHover('copy')} onMouseLeave={() => setControlHover(null)} className="px-3 lg:px-4 py-2.5 bg-slate-800 text-slate-400 mono text-[10px] uppercase border border-slate-700 hover:text-white hover:bg-slate-700 transition-all flex-1 lg:flex-none font-bold">
                      COPY
                    </button>
                    <button onClick={triggerManualSync} onMouseEnter={() => setControlHover('sync')} onMouseLeave={() => setControlHover(null)} className={`px-4 lg:px-6 py-2.5 mono font-bold text-[10px] uppercase transition-all flex items-center justify-center flex-1 lg:flex-none ${activeTab === 'forge' ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}>
                      SYNC
                    </button>
                    <button 
                      onClick={() => setActiveTab('chat')} 
                      className="p-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-sm transition-all shadow-lg flex-none"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <textarea 
                    className="absolute inset-0 w-full h-full bg-black/30 p-5 lg:p-10 text-[14px] lg:text-base text-slate-300 mono focus:outline-none focus:bg-black/50 transition-all custom-scrollbar resize-none leading-relaxed"
                    placeholder={activeTab === 'forge' ? "PASTE_DATA_HERE..." : "DESCRIBE_IDENTITY..."}
                    value={activeTab === 'forge' ? (data.personaAugmentations[data.activePersona] || '') : data.userPrompt}
                    onChange={(e) => {
                      if (activeTab === 'forge') {
                        setData(prev => ({ 
                          ...prev, 
                          personaAugmentations: { ...prev.personaAugmentations, [data.activePersona]: e.target.value } 
                        }));
                      } else {
                        setData(prev => ({ ...prev, userPrompt: e.target.value }));
                      }
                      setSaveStatus('SAVING');
                      setTimeout(() => setSaveStatus('SAVED'), 150);
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'userlog' && (
            <div className="h-full overflow-y-auto custom-scrollbar p-4 lg:p-8 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500 relative">
               <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-8 sticky top-0 bg-[#05060b]/95 backdrop-blur-xl z-20">
                <h2 className="text-cyan-400 font-bold mono uppercase tracking-[0.3em] text-sm lg:text-xl">Neural_Archive_Log</h2>
                <button 
                  onClick={() => setActiveTab('chat')} 
                  className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-sm transition-all flex items-center space-x-2 px-4 lg:px-6 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-[11px] mono font-bold">CLOSE</span>
                </button>
              </div>

              {data.conversations.length === 0 ? (
                <div className="text-center py-32 opacity-20 mono uppercase tracking-[0.5em] text-xs">No records retrieved from storage matrix.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {data.conversations.map(conv => (
                    <div key={conv.id} className="border border-slate-800 bg-[#0a0b10] p-6 lg:p-8 rounded-sm space-y-5 hover:border-cyan-500/40 transition-all flex flex-col group hover:bg-[#0c0e16]">
                      <div className="flex justify-between items-center shrink-0">
                        <span className="text-[10px] mono text-cyan-500 font-bold uppercase tracking-widest">{conv.persona}</span>
                        <span className="text-[9px] mono text-slate-600 font-bold">{new Date(conv.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-sm lg:text-base font-bold mono text-slate-100 uppercase truncate group-hover:text-white">{conv.title}</h3>
                      <div className="space-y-3 opacity-60 flex-1">
                        {conv.messages.slice(-2).map(m => (
                          <div key={m.id} className="text-[12px] lg:text-sm font-serif italic border-l-2 border-slate-800 group-hover:border-cyan-900 pl-4 py-2 line-clamp-3">
                            "{m.content}"
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end pt-4 shrink-0">
                        <button onClick={() => { setData(prev => ({ ...prev, currentConversationId: conv.id })); setActiveTab('chat'); }} className="text-[10px] mono text-slate-500 hover:text-cyan-400 uppercase tracking-[0.2em] border border-slate-800 group-hover:border-cyan-500/30 px-5 py-2.5 active:bg-cyan-500 active:text-slate-900 transition-all font-bold">RESUME_THREAD</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'graph' && (
             <div className="h-full w-full">
               <ConceptMap concepts={data.concepts} onConceptClick={() => {}} />
             </div>
          )}
          
          {activeTab === 'notes' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 h-full overflow-y-auto custom-scrollbar">
               {data.notes.map(note => (
                 <div key={note.id} className="p-6 border border-slate-800 bg-[#0a0b10] rounded-sm hover:border-cyan-500/50 cursor-pointer h-fit flex flex-col group transition-all">
                    <span className="text-[10px] mono text-slate-600 group-hover:text-cyan-500 uppercase block mb-3 truncate shrink-0 tracking-widest font-bold">{note.title || 'MEMORY_FRAGMENT'}</span>
                    <p className="text-slate-400 group-hover:text-slate-200 text-xs lg:text-sm italic leading-relaxed">"{note.content}"</p>
                 </div>
               ))}
               {data.notes.length === 0 && (
                 <div className="col-span-full h-full flex flex-col items-center justify-center opacity-20 mono uppercase text-xs tracking-[0.5em] space-y-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 12h14M5 16h14" /></svg>
                    <span>No data fragments indexed.</span>
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
