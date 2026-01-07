
import React, { useState, useEffect, useMemo } from 'react';
import { Persona, Conversation, Message, SophiData, Note } from './types';
import { loadSophiData, saveSophiData, exportToCSV } from './utils/storage';
import { getPhilosophicalResponse, generateThoughtExperiment } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ConceptGraph from './components/ConceptGraph';

const TAB_DESCRIPTIONS: Record<string, string> = {
  chat: "TERMINAL: ACTIVE_DIALOGUE_INTERFACE. ENGAGE IN DIALECTIC REASONING WITH SELECTED PHILOSOPHER.",
  forge: "PERSONA_FORGE: KNOWLEDGE_AUGMENTATION. INJECT CUSTOM LOGIC, TRANSCRIPTS, AND AXIOMS INTO THE AI.",
  graph: "NEURAL_MAP: TOPOLOGICAL_VISUALIZATION. EXPLORE INTERCONNECTED CONCEPTS EXTRACTED FROM LOGS.",
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

  return (
    <div className="flex h-screen w-full bg-[#05060b] text-slate-300 overflow-hidden">
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
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-[#0a0b10] z-40 relative">
          <div className="flex items-center space-x-6 h-full">
            {['chat', 'forge', 'graph', 'notes'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t as any)}
                onMouseEnter={() => setHoveredTab(t)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`h-full px-2 text-[10px] mono uppercase tracking-[0.2em] border-b-2 transition-all ${activeTab === t ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-600 hover:text-slate-400'}`}
              >
                {t}
              </button>
            ))}
          </div>
          {hoveredTab && (
            <div className="absolute top-14 left-6 right-6 py-2 border-x border-b border-slate-800 bg-black/90 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-[9px] mono text-cyan-500/80 font-bold tracking-widest px-4">{TAB_DESCRIPTIONS[hoveredTab]}</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-hidden relative p-4 bg-[#05060b]">
          {activeTab === 'chat' && (
            <ChatWindow 
              messages={activeConversation?.messages || []}
              activePersona={data.activePersona}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}

          {(activeTab === 'forge' || activeTab === 'userprompt') && (
            <div className="h-full flex flex-col p-4 animate-in fade-in duration-500 relative">
              {controlHover && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 mono text-[9px] font-bold py-2 px-6 z-50 rounded-b-sm border-x border-b shadow-2xl animate-in slide-in-from-top-4 max-w-lg text-center leading-tight ${activeTab === 'forge' ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-cyan-500 text-slate-900 border-cyan-400'}`}>
                  {TOOLTIPS[controlHover]}
                </div>
              )}

              <div className={`flex-1 flex flex-col w-full max-w-6xl mx-auto bg-[#0a0b10] border rounded-sm overflow-hidden transition-all ${activeTab === 'forge' ? 'border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : 'border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]'}`}>
                <div className="bg-black/40 border-b border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 border flex items-center justify-center rounded-sm ${activeTab === 'forge' ? 'border-amber-500/30 bg-amber-500/5 text-amber-500' : 'border-cyan-500/30 bg-cyan-500/5 text-cyan-500'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={activeTab === 'forge' ? "M13 10V3L4 14h7v7l9-11h-7z" : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"} />
                      </svg>
                    </div>
                    <div>
                      <h2 className={`font-bold mono uppercase tracking-[0.3em] flex items-center mb-1 ${activeTab === 'forge' ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {activeTab === 'forge' ? 'Persona_Forge' : 'User_Identity_Prompt'}
                      </h2>
                      <p className="text-[10px] text-slate-500 mono flex items-center">
                        <span className="w-1 h-1 bg-slate-700 rounded-full mr-2"></span>
                        {activeTab === 'forge' ? <>Augmenting: <span className="text-amber-500 font-bold ml-1">[{data.activePersona.toUpperCase()}]</span></> : <>Modifying: <span className="text-cyan-500 font-bold ml-1">[GLOBAL_MATRIX]</span></>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button id="copy-btn" onClick={copyToClipboard} onMouseEnter={() => setControlHover('copy')} onMouseLeave={() => setControlHover(null)} className="px-4 py-2 bg-slate-800 text-slate-400 mono text-[10px] uppercase border border-slate-700 hover:text-white hover:border-slate-500 transition-all">
                      COPY_DATA
                    </button>
                    <button onClick={triggerManualSync} onMouseEnter={() => setControlHover('sync')} onMouseLeave={() => setControlHover(null)} className={`px-6 py-2 mono font-bold text-[10px] uppercase transition-all flex items-center ${activeTab === 'forge' ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400'}`}>
                      SYNC_LOGIC
                    </button>
                    <div onMouseEnter={() => setControlHover('status')} onMouseLeave={() => setControlHover(null)} className={`px-4 py-2 mono text-[10px] uppercase border rounded-sm transition-all min-w-[80px] text-center cursor-help ${saveStatus === 'SAVED' ? 'bg-lime-500/10 text-lime-400 border-lime-500/30' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                      {saveStatus === 'IDLE' ? 'STANDBY' : saveStatus}
                    </div>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <div className="absolute top-4 left-4 z-10 opacity-20 pointer-events-none">
                    <span className={`text-[8px] mono uppercase tracking-[0.5em] font-bold ${activeTab === 'forge' ? 'text-amber-500' : 'text-cyan-500'}`}>
                      {activeTab === 'forge' ? 'KNOWLEDGE_BUFFER' : 'IDENTITY_SECTOR'}
                    </span>
                  </div>
                  <textarea 
                    className="absolute inset-0 w-full h-full bg-black/20 p-8 text-sm text-slate-300 mono focus:outline-none focus:bg-black/40 transition-all custom-scrollbar resize-none leading-relaxed"
                    placeholder={activeTab === 'forge' ? "PASTE_PHILOSOPHICAL_DATA_HERE..." : "DESCRIBE_YOURSELF_FOR_THE_AI_SYSTEM..."}
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
            <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4 max-w-6xl mx-auto animate-in fade-in duration-500">
              <h2 className="text-cyan-400 font-bold mono uppercase tracking-[0.3em] mb-8 border-b border-slate-800 pb-4">Consolidated_Neural_Log</h2>
              {data.conversations.length === 0 ? (
                <div className="text-center py-20 opacity-20 mono uppercase tracking-widest">No history recorded in matrix.</div>
              ) : (
                data.conversations.map(conv => (
                  <div key={conv.id} className="border border-slate-800 bg-[#0a0b10] p-6 rounded-sm space-y-4 hover:border-cyan-500/30 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] mono text-cyan-500 font-bold uppercase tracking-widest">{conv.persona} MATRIX</span>
                      <span className="text-[9px] mono text-slate-600">{new Date(conv.createdAt).toLocaleString()}</span>
                    </div>
                    <h3 className="text-sm font-bold mono text-slate-200 uppercase">{conv.title}</h3>
                    <div className="space-y-2 opacity-60">
                      {conv.messages.slice(-3).map(m => (
                        <div key={m.id} className="text-xs font-serif italic border-l border-slate-700 pl-4 py-1">
                          <span className="text-[8px] mono uppercase text-slate-500 mr-2">[{m.role}]</span>
                          "{m.content.slice(0, 150)}..."
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => { setData(prev => ({ ...prev, currentConversationId: conv.id })); setActiveTab('chat'); }} className="text-[9px] mono text-slate-500 hover:text-cyan-400 uppercase tracking-widest border border-slate-800 px-3 py-1 hover:border-cyan-500/50 transition-all">RESUME_DIALECTIC</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'graph' && <ConceptGraph concepts={data.concepts} onConceptClick={() => {}} />}
          {activeTab === 'notes' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-full pr-2 custom-scrollbar">
               {data.notes.map(note => (
                 <div key={note.id} className="p-4 border border-slate-800 bg-[#0a0b10] rounded-sm hover:border-slate-500 cursor-pointer">
                    <span className="text-[10px] mono text-slate-500 uppercase block mb-2">{note.title || 'ARCHIVE'}</span>
                    <p className="text-slate-400 text-xs italic">"{note.content}"</p>
                 </div>
               ))}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
