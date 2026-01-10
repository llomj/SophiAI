import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Persona, Conversation, Message, SophiData, Note, Concept, CustomPersona } from './types';
import { loadSophiData, saveSophiData, exportToCSV } from './utils/storage';
import { getPhilosophicalResponse } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ConceptMap from './components/ConceptGraph';

const App: React.FC = () => {
  // BOOTSTRAP STATE: Start empty to allow the splash screen to render immediately
  const [archive, setArchive] = useState<SophiData | null>(null);
  
  // FAST UI STATE: Handles navigation and immediate feedback
  const [activePersona, setActivePersona] = useState<string>(Persona.TJUMP);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'graph' | 'notes' | 'forge' | 'userlog' | 'userprompt' | 'customise'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [newPersona, setNewPersona] = useState({ name: '', description: '', instruction: '' });

  // 1. ASYNCHRONOUS INITIALIZATION
  // Move heavy JSON parsing and memory allocation out of the main thread boot
  useEffect(() => {
    const initTimer = setTimeout(() => {
      const loadedData = loadSophiData();
      setArchive(loadedData);
      setActivePersona(loadedData.activePersona);
      setCurrentConversationId(loadedData.currentConversationId);
      
      // Delay finishing the loading animation to let the browser breathe
      setTimeout(() => setIsInitializing(false), 300);
    }, 100);
    return () => clearTimeout(initTimer);
  }, []);

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
    return archive.conversations.find(c => c.id === currentConversationId) || null;
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
        persona: activePersona,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      updatedConversations = [newConv, ...updatedConversations];
      setCurrentConversationId(currentId);
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

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        metadata: { contradictionDetected, fallacies }
      };

      setArchive(prev => {
        if (!prev) return null;
        return {
          ...prev,
          conversations: prev.conversations.map(c => 
            c.id === currentId ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: Date.now() } : c
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
  }, [activePersona, currentConversationId, archive]);

  const handlePersonaChange = (p: string) => {
    setActivePersona(p);
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
    <div className="flex h-screen w-full bg-[#05060b] text-slate-300 overflow-hidden overflow-x-hidden relative font-sans touch-none lg:touch-auto" style={{ maxWidth: '100%', width: '100%', height: '100vh', height: '-webkit-fill-available', overflowX: 'hidden', position: 'fixed', left: 0, right: 0, top: 0 }}>
      {isHelpOpen && (
        <div className="fixed inset-0 z-[150] bg-black/95 p-6 flex items-center justify-center animate-in fade-in" onClick={() => setIsHelpOpen(false)}>
           <div className="max-w-md bg-[#0a0b10] border border-cyan-500/20 p-8 space-y-4">
              <h2 className="mono text-cyan-400 font-bold uppercase tracking-widest text-sm">System Operations</h2>
              <p className="text-xs text-slate-400 leading-relaxed italic serif">Engage the reasoning matrices. Your dialectic sessions are archived locally for concept mapping.</p>
              <button className="w-full py-3 bg-cyan-500 text-slate-950 mono text-[10px] font-bold uppercase">Resume Session</button>
           </div>
        </div>
      )}

      <Sidebar 
        conversations={archive.conversations}
        activeId={currentConversationId}
        onSelect={setCurrentConversationId}
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
        onLaunchDialectic={(t, p) => { setActivePersona(p); setCurrentConversationId(null); setActiveTab('chat'); }}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full bg-[#05060b] overflow-x-hidden">
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
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onToggleSidebar={() => setIsSidebarOpen(true)}
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
            <div className="h-full p-4 lg:p-12 animate-in fade-in">
              <div className="h-full bg-[#0a0b10] border border-slate-800 rounded-sm flex flex-col">
                <div className="p-4 border-b border-slate-800 mono text-[10px] text-slate-500 uppercase tracking-widest">
                  {activeTab === 'forge' ? `Logic_Forge: ${activePersona}` : 'User_Identity_Protocol'}
                </div>
                <textarea 
                  className="flex-1 w-full bg-transparent p-6 mono text-sm text-slate-300 outline-none resize-none leading-relaxed"
                  value={activeTab === 'forge' ? (archive.personaAugmentations[activePersona] || '') : archive.userPrompt}
                  onChange={(e) => {
                    const val = e.target.value;
                    setArchive(prev => {
                      if (!prev) return null;
                      if (activeTab === 'forge') {
                        return { ...prev, personaAugmentations: { ...prev.personaAugmentations, [activePersona]: val } };
                      } else {
                        return { ...prev, userPrompt: val };
                      }
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
