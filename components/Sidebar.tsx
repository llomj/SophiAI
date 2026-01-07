
import React, { useState, useMemo } from 'react';
import { Conversation, Persona } from '../types';
import { PERSONA_CONFIGS } from '../constants';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onSearch: (term: string) => void;
  activePersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  onExport: () => void;
  onOpenUserLog: () => void;
  onOpenUserPrompt: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  conversations, 
  activeId, 
  onSelect, 
  onNew, 
  onSearch, 
  activePersona, 
  onPersonaChange,
  onExport,
  onOpenUserLog,
  onOpenUserPrompt,
  isOpen,
  onToggle
}) => {
  const [hoveredPersona, setHoveredPersona] = useState<Persona | null>(null);

  const personasByCategory = useMemo(() => {
    const categories: Record<string, Persona[]> = {};
    (Object.keys(PERSONA_CONFIGS) as Persona[]).forEach(p => {
      const cat = PERSONA_CONFIGS[p].category;
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(p);
    });
    return categories;
  }, []);

  const handleSelectConversation = (id: string) => {
    onSelect(id);
    if (window.innerWidth < 1024) onToggle?.();
  };

  const handlePersonaSelect = (p: Persona) => {
    onPersonaChange(p);
    if (window.innerWidth < 1024) onToggle?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />
      
      {/* Sidebar - w-full on mobile for full width coverage */}
      <aside className={`
        fixed inset-y-0 left-0 w-full lg:w-72 bg-[#0a0b10] border-r border-slate-800 flex flex-col shrink-0 z-[70] 
        transition-transform duration-300 ease-in-out transform shadow-[20px_0_50px_rgba(0,0,0,0.5)]
        lg:relative lg:translate-x-0 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with Safe Area handling */}
        <div className="pt-[env(safe-area-inset-top)] border-b border-slate-800 bg-black/20">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-cyan-500 rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <span className="text-slate-900 font-serif font-bold text-xl italic">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tighter text-slate-100 mono leading-none">SophiAI</h1>
                <span className="text-[8px] mono text-cyan-500/50 uppercase tracking-[0.2em]">Matrix_v3.5_Stable</span>
              </div>
            </div>
            <button 
              onClick={onToggle} 
              className="lg:hidden p-2 text-slate-100 hover:text-white bg-slate-800/80 rounded-full transition-all flex items-center justify-center w-10 h-10 border border-slate-600 shadow-xl"
              aria-label="Close sidebar"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-b border-slate-800">
          <button 
            onClick={() => { onNew(); if(window.innerWidth < 1024) onToggle?.(); }} 
            className="w-full flex items-center justify-center space-x-2 py-3.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-sm transition-all font-bold text-xs mono tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span>NEW_DIALECTIC</span>
          </button>
        </div>

        {/* Matrix Selection - Scrollable area */}
        <div className="px-4 py-4 border-b border-slate-800 flex flex-col h-[35vh] lg:h-[400px] overflow-hidden">
          <label className="text-[9px] uppercase font-bold text-slate-600 tracking-[0.2em] block mb-3 px-2 mono shrink-0">Reasoning_Matrices</label>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {(Object.entries(personasByCategory) as [string, Persona[]][]).map(([category, personas]) => (
              <div key={category} className="space-y-1.5">
                <div className="px-2 mb-1"><span className="text-[8px] mono text-slate-700 uppercase tracking-[0.3em] font-bold">{category}</span></div>
                {personas.map(p => {
                  const config = PERSONA_CONFIGS[p];
                  const isActive = activePersona === p;
                  return (
                    <button 
                      key={p} 
                      onClick={() => handlePersonaSelect(p)} 
                      className={`w-full text-left px-3 py-2.5 rounded-sm text-[10px] mono border transition-all flex items-center justify-between ${isActive ? `${config.color} ${config.glow} border-current ring-1 ring-current/20` : 'border-slate-800 bg-slate-900/10 hover:bg-slate-800/50 text-slate-500 hover:text-slate-300'}`}
                    >
                      <span className="uppercase tracking-wider truncate mr-2">{p}</span>
                      <div className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-current animate-pulse' : 'bg-slate-800'}`}></div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* History Area */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 custom-scrollbar bg-black/10">
          <label className="text-[9px] uppercase font-bold text-slate-700 tracking-[0.2em] block mb-2 px-3 mono shrink-0">Neural_History</label>
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => handleSelectConversation(conv.id)} className={`w-full text-left px-4 py-3.5 rounded-sm transition-all group ${activeId === conv.id ? 'bg-slate-800/60 border-l-2 border-cyan-500 text-white' : 'text-slate-500 hover:bg-slate-900 border-l-2 border-transparent'}`}>
              <div className={`text-xs font-bold truncate ${activeId === conv.id ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>{conv.title}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[8px] opacity-40 mono">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                <span className={`text-[7px] px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-tighter ${activeId === conv.id ? 'bg-cyan-500/10 text-cyan-500' : 'bg-slate-800 text-slate-600'} mono`}>{conv.persona}</span>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="px-4 py-8 text-center">
              <span className="text-[9px] mono text-slate-800 uppercase tracking-widest">No_Logs_Detected</span>
            </div>
          )}
        </div>

        {/* Footer actions with Safe Area handling */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0b10] pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-2 gap-2 mb-3 px-2">
            <button onClick={() => { onOpenUserPrompt(); if(window.innerWidth < 1024) onToggle?.(); }} className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center justify-center space-x-2 mono transition-all py-3 border border-slate-800 rounded bg-slate-900/50 active:scale-95">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>IDENTITY</span>
            </button>
            <button onClick={() => { onOpenUserLog(); if(window.innerWidth < 1024) onToggle?.(); }} className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center justify-center space-x-2 mono transition-all py-3 border border-slate-800 rounded bg-slate-900/50 active:scale-95">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253" /></svg>
              <span>ARCHIVES</span>
            </button>
          </div>
          <button onClick={onExport} className="w-full text-[9px] text-slate-600 hover:text-cyan-400 flex items-center justify-center space-x-2 mono transition-colors py-2 opacity-60 hover:opacity-100 border-t border-slate-900 mt-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>EXTRACT_CSV_DATA</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
