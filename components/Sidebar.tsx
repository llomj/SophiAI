
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
  const [searchTerm, setSearchTerm] = useState('');

  // Sort categories and personas alphabetically
  const sortedPersonasByCategory = useMemo(() => {
    const categories: Record<string, Persona[]> = {};
    const allPersonas = Object.keys(PERSONA_CONFIGS) as Persona[];
    
    // Filter by search term first
    const filteredPersonas = allPersonas.filter(p => 
      p.toLowerCase().includes(searchTerm.toLowerCase()) || 
      PERSONA_CONFIGS[p].description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredPersonas.forEach(p => {
      const cat = PERSONA_CONFIGS[p].category;
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(p);
    });

    // Sort categories alphabetically
    const sortedCatNames = Object.keys(categories).sort();
    
    const sortedResult: Record<string, Persona[]> = {};
    sortedCatNames.forEach(cat => {
      // Sort personas within category alphabetically
      sortedResult[cat] = categories[cat].sort();
    });

    return sortedResult;
  }, [searchTerm]);

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
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-full lg:w-80 bg-[#0a0b10] border-r border-slate-800 flex flex-col shrink-0 z-[70] 
        transition-transform duration-300 ease-in-out transform shadow-[20px_0_50px_rgba(0,0,0,0.5)]
        lg:relative lg:translate-x-0 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with Search Interface */}
        <div className="pt-[env(safe-area-inset-top)] border-b border-slate-800 bg-black/20 shrink-0">
          <div className="p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <span className="text-slate-900 font-serif font-bold text-lg italic">S</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tighter text-slate-100 mono leading-none">SophiAI</h1>
                  <span className="text-[7px] mono text-cyan-500/50 uppercase tracking-[0.2em]">Neural_Matrix</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onToggle} 
                  className="lg:hidden p-1.5 text-slate-400 hover:text-white bg-slate-800/40 rounded-sm transition-all border border-slate-700/50"
                  aria-label="Close sidebar"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Search Bar - Positioned near the close/action area */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-3.5 w-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="FIND_PERSONA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                list="persona-autocomplete"
                className="block w-full pl-9 pr-3 py-2 bg-[#05060b] border border-slate-800 text-[10px] mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 rounded-sm transition-all"
              />
              <datalist id="persona-autocomplete">
                {Object.keys(PERSONA_CONFIGS).map(p => (
                  <option key={p} value={p} />
                ))}
              </datalist>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-slate-400"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* New Dialectic Button */}
        <div className="p-3 border-b border-slate-800 bg-[#0a0b10] shrink-0">
          <button 
            onClick={() => { onNew(); if(window.innerWidth < 1024) onToggle?.(); }} 
            className="w-full flex items-center justify-center space-x-2 py-3 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-sm transition-all font-bold text-[10px] mono tracking-[0.2em]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            <span>NEW_DIALECTIC</span>
          </button>
        </div>

        {/* Matrix Selection - Organized Alphabetically */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-black/5">
          <div className="p-3 space-y-6">
            {(Object.entries(sortedPersonasByCategory) as [string, Persona[]][]).map(([category, personas]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[8px] mono text-slate-700 uppercase tracking-[0.3em] font-bold">{category}</span>
                  <div className="h-px bg-slate-900 flex-1 ml-4 opacity-50"></div>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {personas.map(p => {
                    const config = PERSONA_CONFIGS[p];
                    const isActive = activePersona === p;
                    return (
                      <button 
                        key={p} 
                        onClick={() => handlePersonaSelect(p)} 
                        title={config.description}
                        className={`w-full text-left px-3 py-2.5 rounded-sm text-[10px] mono border transition-all flex items-center justify-between group ${isActive ? `${config.color} ${config.glow} border-current ring-1 ring-current/20` : 'border-slate-800/40 bg-[#0d0f17]/40 hover:bg-slate-800/30 text-slate-500 hover:text-slate-300'}`}
                      >
                        <span className="uppercase tracking-wider truncate mr-2">{p}</span>
                        <div className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-current animate-pulse' : 'bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity'}`}></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {Object.keys(sortedPersonasByCategory).length === 0 && (
              <div className="py-20 text-center space-y-3 opacity-20">
                <svg className="w-8 h-8 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="text-[10px] mono uppercase tracking-widest">No_Persona_Found</p>
              </div>
            )}
          </div>
        </div>

        {/* History Divider */}
        <div className="px-4 py-2 border-y border-slate-800 bg-[#05060b] shrink-0">
          <label className="text-[9px] uppercase font-bold text-slate-700 tracking-[0.2em] mono">Recent_Transcripts</label>
        </div>

        {/* History Area */}
        <div className="h-1/4 min-h-[150px] overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar bg-black/20 shrink-0">
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => handleSelectConversation(conv.id)} className={`w-full text-left px-3 py-2.5 rounded-sm transition-all group ${activeId === conv.id ? 'bg-slate-800/40 border-l border-cyan-500 text-white' : 'text-slate-500 hover:bg-slate-900 border-l border-transparent'}`}>
              <div className={`text-[11px] font-bold truncate ${activeId === conv.id ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>{conv.title}</div>
              <div className="flex items-center justify-between mt-1 opacity-40">
                <span className="text-[7px] mono uppercase">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                <span className="text-[7px] mono uppercase tracking-tighter">{conv.persona}</span>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="px-4 py-8 text-center">
              <span className="text-[9px] mono text-slate-800 uppercase tracking-widest">Empty_Archive</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800 bg-[#0a0b10] pb-[env(safe-area-inset-bottom)] shrink-0">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={() => { onOpenUserPrompt(); if(window.innerWidth < 1024) onToggle?.(); }} className="text-[9px] text-slate-400 hover:text-cyan-400 flex items-center justify-center space-x-2 mono transition-all py-2.5 border border-slate-800 bg-slate-900/40 rounded-sm">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>ID</span>
            </button>
            <button onClick={() => { onOpenUserLog(); if(window.innerWidth < 1024) onToggle?.(); }} className="text-[9px] text-slate-400 hover:text-cyan-400 flex items-center justify-center space-x-2 mono transition-all py-2.5 border border-slate-800 bg-slate-900/40 rounded-sm">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253" /></svg>
              <span>LOG</span>
            </button>
          </div>
          <button onClick={onExport} className="w-full text-[8px] text-slate-600 hover:text-cyan-400 flex items-center justify-center space-x-2 mono transition-colors py-1.5 opacity-60 hover:opacity-100">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>EXPORT_DATA</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
