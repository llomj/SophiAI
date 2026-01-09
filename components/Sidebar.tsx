
import React, { useState, useMemo, memo } from 'react';
import { Conversation, Persona, CustomPersona } from '../types';
import { PERSONA_CONFIGS, PHILOSOPHY_TOPICS } from '../constants';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onSearch: (term: string) => void;
  activePersona: string;
  onPersonaChange: (persona: string) => void;
  onExport: () => void;
  onOpenUserLog: () => void;
  onOpenUserPrompt: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
  customPersonas: CustomPersona[];
  onAddCustomPersona: () => void;
  onDeleteCustomPersona: (id: string) => void;
  emojiMode: boolean;
  onToggleEmojis: () => void;
  onToggleHelp: () => void;
  onLaunchDialectic: (topic: string, persona: string) => void;
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
  onToggle,
  customPersonas,
  onAddCustomPersona,
  onDeleteCustomPersona,
  emojiMode,
  onToggleEmojis,
  onToggleHelp,
  onLaunchDialectic
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{id: string, name: string} | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  
  // Topic Modal State
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTargetPersona, setSelectedTargetPersona] = useState(activePersona);

  const activeCustom = useMemo(() => 
    customPersonas.find(p => p.name === activePersona), 
    [customPersonas, activePersona]
  );

  const sortedPersonasByCategory = useMemo(() => {
    const categories: Record<string, string[]> = {};
    const allPersonas = Object.keys(PERSONA_CONFIGS);
    
    const filteredPersonas = allPersonas.filter(p => 
      p.toLowerCase().includes(searchTerm.toLowerCase()) || 
      PERSONA_CONFIGS[p].description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredPersonas.forEach(p => {
      const cat = PERSONA_CONFIGS[p].category;
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(p);
    });

    const sortedResult: Record<string, string[]> = {};
    Object.keys(categories).sort().forEach(cat => {
      sortedResult[cat] = categories[cat].sort();
    });

    return sortedResult;
  }, [searchTerm]);

  const filteredCustomPersonas = useMemo(() => {
    return customPersonas.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customPersonas, searchTerm]);

  const handleSelectConversation = (id: string) => {
    onSelect(id);
    if (window.innerWidth < 1024) onToggle?.();
  };

  const handlePersonaSelect = (p: string) => {
    onPersonaChange(p);
    if (window.innerWidth < 1024) onToggle?.();
  };

  const handleAddNewClick = () => {
    onAddCustomPersona();
    if (window.innerWidth < 1024) onToggle?.();
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      onDeleteCustomPersona(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  const commitDialectic = () => {
    if (!selectedTopic) return;
    onLaunchDialectic(selectedTopic, selectedTargetPersona);
    setIsTopicModalOpen(false);
    setSelectedTopic(null);
    if (window.innerWidth < 1024) onToggle?.();
  };

  return (
    <>
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 lg:p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#05060b] border border-cyan-500/30 w-full max-w-6xl h-full lg:h-[90vh] flex flex-col shadow-[0_0_100px_rgba(6,182,212,0.1)] rounded-sm overflow-hidden border-t-4 border-t-cyan-500">
            <div className="p-4 lg:p-6 border-b border-slate-800 flex justify-between items-center bg-black/40 shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 flex items-center justify-center rounded-sm">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <h2 className="text-sm lg:text-xl font-bold mono text-slate-100 uppercase tracking-[0.3em]">Topic_Vector_Architect</h2>
                  <p className="text-[8px] lg:text-[10px] mono text-cyan-500/60 tracking-widest uppercase">Target Subject Mapping</p>
                </div>
              </div>
              <button onClick={() => setIsTopicModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-800 bg-black/20 overflow-x-hidden lg:overflow-y-auto custom-scrollbar shrink-0 flex lg:flex-col no-scrollbar" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
                {PHILOSOPHY_TOPICS.map((cat, idx) => (
                  <button 
                    key={cat.name} 
                    onClick={() => { setSelectedCategoryIdx(idx); setSelectedTopic(null); }}
                    className={`whitespace-nowrap lg:whitespace-normal text-left px-4 py-3 lg:px-6 lg:py-3.5 mono text-[9px] lg:text-[10px] uppercase font-bold tracking-widest transition-all border-b-2 lg:border-b-0 lg:border-l-2 shrink-0 ${selectedCategoryIdx === idx ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500' : 'text-slate-600 border-transparent hover:text-slate-300 hover:bg-white/5'}`}
                  >
                    <span className="opacity-50 mr-2">{String(idx + 1).padStart(2, '0')}</span> {cat.name}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar bg-black/10">
                <div className="space-y-8 lg:space-y-12">
                  {/* Fixed 'Property map does not exist on type unknown' error by casting sections to any[] */}
                  {(PHILOSOPHY_TOPICS[selectedCategoryIdx].sections as any[]).map((sec) => (
                    <div key={sec.name}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                        <h3 className="text-cyan-500/80 mono text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.4em] px-2">{sec.name}</h3>
                        <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/30 to-transparent"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                        {/* Fixed potential 'Property map does not exist on type unknown' error by casting topics to any[] */}
                        {(sec.topics as any[]).map((topic) => (
                          <button
                            key={topic}
                            onClick={() => setSelectedTopic(topic)}
                            className={`p-3 text-left border rounded-sm transition-all duration-300 transform active:scale-95 group relative overflow-hidden ${selectedTopic === topic ? 'bg-cyan-500/20 border-cyan-500 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-[#0a0b10] border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
                          >
                            <span className="mono text-[9px] lg:text-[10px] tracking-tight uppercase block truncate relative z-10">{topic}</span>
                            {selectedTopic === topic && <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-800 bg-black/40 p-4 lg:p-6 flex flex-col space-y-6 shrink-0 bg-[#0a0b10] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[9px] lg:text-[10px] mono text-slate-500 uppercase tracking-widest font-bold block">Assigned_Matrix</label>
                  <div className="relative">
                    <select 
                      value={selectedTargetPersona}
                      onChange={(e) => setSelectedTargetPersona(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-3 mono text-[10px] text-cyan-400 focus:outline-none focus:border-cyan-500 uppercase tracking-tight appearance-none rounded-sm"
                    >
                      {Object.keys(PERSONA_CONFIGS).sort().map(p => (
                        <option key={p} value={p}>{p.toUpperCase()}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  {selectedTopic ? (
                    <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-sm mb-6 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[8px] mono text-cyan-500 uppercase font-black">Target_Commit:</span>
                        <span className="text-[8px] mono text-slate-700 font-bold uppercase">Ready</span>
                      </div>
                      <p className="text-[11px] text-slate-200 mono uppercase font-bold tracking-tighter leading-tight">[{selectedTopic}]</p>
                      <p className="text-[9px] text-slate-500 mono mt-3 italic leading-relaxed">System ready to sequence DNA of {selectedTargetPersona} matrix for targeted inquiry.</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-900/40 border border-dashed border-slate-800 rounded-sm mb-6 opacity-40 flex flex-col items-center justify-center text-center space-y-2">
                       <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                       <p className="text-[8px] text-slate-600 mono uppercase tracking-widest">Select_Topic_To_Proceed</p>
                    </div>
                  )}

                  <button 
                    disabled={!selectedTopic}
                    onClick={commitDialectic}
                    className="w-full py-4 bg-cyan-500 text-slate-950 font-bold mono text-[10px] lg:text-[11px] uppercase tracking-[0.3em] hover:bg-cyan-400 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)] active:scale-95"
                  >
                    INITIALIZE_DIALECTIC
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0b10] border border-red-500/50 p-6 lg:p-8 max-w-md w-full shadow-[0_0_60px_rgba(239,68,68,0.3)] rounded-sm border-t-4 border-t-red-600">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-sm flex items-center justify-center border border-red-600/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h3 className="text-red-500 font-bold mono text-lg uppercase tracking-widest leading-tight">Neural_Purge</h3>
                <p className="text-[10px] text-red-500/60 mono uppercase font-bold tracking-widest">Protocol: WIPEOUT_DNA</p>
              </div>
            </div>
            <p className="text-[12px] lg:text-sm mono text-slate-300 leading-relaxed mb-8 border-l-2 border-red-500/30 pl-4 bg-red-500/5 py-4">
              ARE YOU ABSOLUTELY CERTAIN YOU WANT TO PERMANENTLY ERASE THE <span className="text-red-400 font-bold">[{pendingDelete.name.toUpperCase()}]</span> REASONING MATRIX? THIS ACTION IS IRREVERSIBLE AND ALL DNA FRAGMENTS WILL BE WIPED.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white mono font-bold text-[11px] py-4 tracking-widest transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                EXECUTE_PURGE
              </button>
              <button 
                onClick={() => setPendingDelete(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 mono font-bold text-[11px] py-4 tracking-widest transition-all"
              >
                ABORT
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />
      
      <aside className={`
        fixed inset-y-0 left-0 w-full lg:w-72 bg-[#0a0b10] border-r border-slate-800 flex flex-col shrink-0 z-[70] 
        transition-transform duration-300 ease-in-out transform shadow-[20px_0_50px_rgba(0,0,0,0.5)]
        lg:relative lg:translate-x-0 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="pt-[env(safe-area-inset-top)] border-b border-slate-800 bg-black/20 shrink-0">
          <div className="p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div>
                    <h1 className="text-base font-bold tracking-tighter text-slate-100 mono leading-none">SophiAI</h1>
                    <span className="text-[6px] mono text-cyan-500/50 uppercase tracking-[0.2em]">Neural_Matrix</span>
                  </div>
                  <div className="flex items-center space-x-1.5 ml-1">
                    <button 
                      onClick={onToggleEmojis}
                      className={`p-1.5 rounded-full transition-all duration-500 group relative flex items-center justify-center border ${emojiMode ? 'bg-amber-400/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-cyan-500/5 hover:bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}
                      title={emojiMode ? "Disable Emoji Synthesis" : "Enable Emoji Synthesis"}
                    >
                      <span className={`text-[22px] leading-none transition-transform duration-300 ${emojiMode ? 'grayscale-0 scale-110 animate-pulse' : 'grayscale-0 opacity-100'}`}>😊</span>
                    </button>
                    
                    <button 
                      onClick={() => setIsTopicModalOpen(true)}
                      className="p-1.5 rounded-full bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition-all hover:scale-110"
                      title="Philosophy Topic Vector"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </button>

                    <button 
                      onClick={onToggleHelp}
                      className="p-1.5 rounded-full bg-slate-900/40 hover:bg-cyan-500/10 text-slate-500 hover:text-cyan-400 transition-all group"
                      title="System Information"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={onToggle} className="lg:hidden p-1.5 text-slate-400 hover:text-white bg-slate-800/40 rounded-sm">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="relative group">
              <input
                type="text"
                placeholder="FIND_MATRIX..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-8 pr-3 py-1.5 bg-[#05060b] border border-slate-800 text-[9px] mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 rounded-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg className="h-3 w-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-slate-800 bg-[#0a0b10] shrink-0">
          <button 
            onClick={() => { onNew(); if(window.innerWidth < 1024) onToggle?.(); }} 
            className="w-full py-2.5 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-sm transition-all font-bold text-[9px] mono tracking-[0.2em]"
          >
            + NEW_DIALECTIC
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-black/5">
          <div className="p-3 space-y-8">
            <div>
              <div className="flex items-center justify-between px-2 mb-4">
                <span className="text-[13px] mono text-amber-500 uppercase tracking-[0.5em] font-black w-full">CUSTOMISE</span>
              </div>
              <div className="px-2 mb-3 flex space-x-1">
                <button 
                  onClick={handleAddNewClick} 
                  className="flex-1 text-[10px] bg-amber-500/10 border border-amber-500/40 px-2 py-1.5 text-amber-400 hover:bg-amber-500 hover:text-slate-950 mono uppercase font-bold transition-all rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                >
                  + ADD_NEW
                </button>
                {activeCustom && (
                  <button 
                    onClick={() => setPendingDelete({id: activeCustom.id, name: activePersona})} 
                    className="text-[10px] bg-red-500/10 border border-red-500/40 px-2 py-1.5 text-red-400 hover:bg-red-500 hover:text-slate-950 mono uppercase font-bold transition-all rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                  >
                    PURGE
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {filteredCustomPersonas.length === 0 && searchTerm ? (
                  <div className="text-[8px] text-slate-600 mono px-2.5 py-2.5 text-center">
                    No custom matrices found
                  </div>
                ) : (
                  filteredCustomPersonas.map(p => {
                    const isActive = activePersona === p.name;
                    return (
                      <div key={p.id} className="flex items-center space-x-1 group">
                        <button 
                          onClick={() => handlePersonaSelect(p.name)} 
                          className={`flex-1 text-left px-2.5 py-2.5 rounded-sm text-[9px] mono border transition-all duration-300 transform hover:scale-[1.03] hover:translate-x-1 backdrop-blur-sm ${
                            isActive 
                              ? `bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] z-10` 
                              : 'border-slate-800/40 bg-white/5 text-slate-500 hover:text-slate-100 hover:bg-white/10 hover:border-white/20 hover:shadow-lg'
                          }`}
                        >
                          {p.name.toUpperCase()}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {Object.keys(sortedPersonasByCategory).length === 0 && searchTerm ? (
              <div className="text-[8px] text-slate-600 mono px-2 py-4 text-center">
                No matrices found for "{searchTerm}"
              </div>
            ) : (
              (Object.entries(sortedPersonasByCategory) as [string, string[]][]).map(([category, personas]) => (
                <div key={category}>
                  <div className="flex items-center justify-between px-2 mb-4">
                    <span className="text-[13px] mono text-slate-100 uppercase tracking-[0.5em] font-black border-b-2 border-slate-700/50 pb-1.5 w-full">
                      {category === 'Influences' ? 'INTELLECTUAL INFLUENCES' : category.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 px-1">
                    {personas.map(p => {
                      const config = PERSONA_CONFIGS[p];
                      const isActive = activePersona === p;
                      return (
                        <button 
                          key={p} 
                          onClick={() => handlePersonaSelect(p)} 
                          className={`w-full text-left px-3 py-2.5 rounded-sm text-[9px] mono border transition-all duration-300 transform hover:scale-[1.03] hover:translate-x-1 backdrop-blur-sm truncate ${
                            isActive 
                              ? `${config.color} ${config.glow} border-current ring-1 ring-current/20 z-10 font-bold` 
                              : 'border-slate-800/40 bg-white/5 text-slate-500 hover:text-slate-100 hover:bg-white/10 hover:border-white/20 hover:shadow-xl'
                          }`}
                        >
                          {p.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="px-4 py-2 border-y border-slate-800 bg-[#05060b] shrink-0">
          <label className="text-[9px] uppercase font-black text-slate-600 tracking-[0.3em] mono">Archive</label>
        </div>

        <div className="h-1/5 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar bg-black/10 shrink-0">
          {(conversations as Conversation[])
            .filter(conv => {
              if (!searchTerm) return true;
              const searchLower = searchTerm.toLowerCase();
              return conv.title.toLowerCase().includes(searchLower) ||
                     conv.messages.some(msg => msg.content.toLowerCase().includes(searchLower));
            })
            .length === 0 && searchTerm ? (
              <div className="text-[8px] text-slate-600 mono px-3 py-2 text-center">
                No conversations found
              </div>
            ) : (
              (conversations as Conversation[])
                .filter(conv => {
                  if (!searchTerm) return true;
                  const searchLower = searchTerm.toLowerCase();
                  return conv.title.toLowerCase().includes(searchLower) ||
                         conv.messages.some(msg => msg.content.toLowerCase().includes(searchLower));
                })
                .map(conv => (
                  <button 
                    key={conv.id} 
                    onClick={() => handleSelectConversation(conv.id)} 
                    className={`w-full text-left px-3 py-2 rounded-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 ${activeId === conv.id ? 'bg-slate-800/60 text-cyan-400 border border-cyan-500/20 shadow-md' : 'text-slate-600 hover:text-slate-300 border border-transparent'}`}
                  >
                    <div className="text-[9px] font-bold truncate uppercase tracking-tight">{conv.title}</div>
                  </button>
                ))
            )}
        </div>

        <div className="p-3 border-t border-slate-800 bg-[#0a0b10] pb-[env(safe-area-inset-bottom)] shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { onOpenUserPrompt(); if(window.innerWidth < 1024) onToggle?.(); }} className="text-[8px] text-slate-500 hover:text-cyan-400 flex items-center justify-center space-x-1 mono transition-all py-1.5 border border-slate-800 bg-slate-900/40 rounded-sm hover:border-cyan-500/30">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>ID</span>
            </button>
            <button onClick={() => { onOpenUserLog(); if(window.innerWidth < 1024) onToggle?.(); }} className="text-[8px] text-slate-500 hover:text-cyan-400 flex items-center justify-center space-x-1 mono transition-all py-1.5 border border-slate-800 bg-slate-900/40 rounded-sm hover:border-cyan-500/30">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253" /></svg>
              <span>LOG</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);
