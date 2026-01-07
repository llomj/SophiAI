
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
  onOpenUserPrompt: () => void; // New callback
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
  onOpenUserPrompt
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

  return (
    <aside className="w-72 bg-[#0a0b10] border-r border-slate-800 flex flex-col shrink-0 relative z-30">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <span className="text-slate-900 font-serif font-bold text-xl italic">S</span>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-slate-100 mono">SophiAI</h1>
        </div>

        <button onClick={onNew} className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-cyan-400 border border-cyan-500/20 rounded-sm transition-all font-medium text-sm mono">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span>INITIATE_THREAD</span>
        </button>
      </div>

      <div className="px-4 py-4 border-b border-slate-800 flex flex-col h-[400px] overflow-hidden">
        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-3 px-2 mono shrink-0">Reasoning_Matrix_v3.0</label>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {Object.entries(personasByCategory).map(([category, personas]) => (
            <div key={category} className="space-y-1">
              <div className="px-2 mb-1"><span className="text-[8px] mono text-slate-700 uppercase tracking-[0.3em] font-bold">{category}</span></div>
              {personas.map(p => {
                const config = PERSONA_CONFIGS[p];
                const isActive = activePersona === p;
                return (
                  <div key={p} className="relative group" onMouseEnter={() => setHoveredPersona(p)} onMouseLeave={() => setHoveredPersona(null)}>
                    <button onClick={() => onPersonaChange(p)} className={`w-full text-left px-3 py-1.5 rounded-sm text-[10px] mono border transition-all flex items-center justify-between ${isActive ? `${config.color} ${config.glow} border-current` : 'border-slate-800 bg-slate-900/10 hover:bg-slate-800/50 text-slate-600'}`}>
                      <span className="uppercase tracking-wider truncate mr-2">{p}</span>
                      <div className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-current animate-pulse' : 'bg-slate-800'}`}></div>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {conversations.map(conv => (
          <button key={conv.id} onClick={() => onSelect(conv.id)} className={`w-full text-left px-4 py-3 rounded-sm transition-all group ${activeId === conv.id ? 'bg-slate-800/40 border-l-2 border-cyan-500 text-white' : 'text-slate-600 hover:bg-slate-900 border-l-2 border-transparent'}`}>
            <div className={`text-xs font-medium truncate ${activeId === conv.id ? 'text-cyan-300' : 'text-slate-500'}`}>{conv.title}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9px] opacity-30 mono">{new Date(conv.updatedAt).toLocaleDateString()}</span>
              <span className={`text-[8px] px-1 py-0.5 rounded-sm uppercase font-bold tracking-tighter ${activeId === conv.id ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-700'} mono`}>{conv.persona}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
           <button onClick={onExport} className="text-[10px] text-slate-700 hover:text-cyan-400 flex items-center space-x-1 mono transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>EXPORT</span>
          </button>
          
          <button onClick={onOpenUserPrompt} className="text-[10px] text-slate-700 hover:text-cyan-400 flex items-center space-x-1 mono transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span>USER_PROMPT</span>
          </button>

          <button onClick={onOpenUserLog} className="text-[10px] text-slate-700 hover:text-cyan-400 flex items-center space-x-1 mono transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <span>USER_LOG</span>
          </button>
        </div>
        <span className="text-[9px] text-slate-800 font-mono tracking-widest text-center">SYS_LOG_V3.5</span>
      </div>
    </aside>
  );
};

export default Sidebar;
