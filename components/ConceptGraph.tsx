
import React, { useState, useMemo } from 'react';
import { Concept } from '../types';

interface ConceptGraphProps {
  concepts: Concept[];
  onConceptClick: (concept: Concept) => void;
}

const ConceptMap: React.FC<ConceptGraphProps> = ({ concepts, onConceptClick }) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

  const selectedConcept = useMemo(() => 
    concepts.find(c => c.id === selectedConceptId), 
    [concepts, selectedConceptId]
  );

  const conceptsByCategory = useMemo(() => {
    const groups: Record<string, Concept[]> = {};
    concepts.forEach(c => {
      const cat = c.category || 'GENERAL';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(c);
    });
    return groups;
  }, [concepts]);

  const relatedConcepts = useMemo(() => {
    if (!selectedConcept) return [];
    return concepts.filter(c => selectedConcept.connections.includes(c.id));
  }, [concepts, selectedConcept]);

  if (concepts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-30">
        <div className="w-16 h-16 border border-slate-700 rounded-sm flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <p className="mono uppercase tracking-[0.3em] text-xs">No Matrix Nodes Detected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#05060b] overflow-hidden">
      {/* Sidebar - Category Navigator */}
      <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0a0b10]/50 overflow-y-auto custom-scrollbar shrink-0">
        <div className="p-4 border-b border-slate-800 bg-black/20">
          <h3 className="mono text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]">NEURAL_DOMAINS</h3>
        </div>
        <div className="p-2 space-y-1">
          {Object.keys(conceptsByCategory).map(category => (
            <button
              key={category}
              className="w-full text-left px-3 py-2.5 rounded-sm transition-all hover:bg-slate-800/30 group"
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] uppercase text-slate-400 group-hover:text-cyan-400 tracking-wider font-bold">{category}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-600 rounded mono">{conceptsByCategory[category].length}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map View - Scrollable Card Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 bg-[#05060b]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {concepts.map(concept => (
            <div
              key={concept.id}
              onClick={() => {
                setSelectedConceptId(concept.id);
                onConceptClick(concept);
              }}
              className={`p-5 rounded-sm border cursor-pointer transition-all duration-300 relative group flex flex-col h-full ${
                selectedConceptId === concept.id
                  ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                  : 'bg-[#0a0b10] border-slate-800 hover:border-slate-600 hover:bg-[#0e101a]'
              }`}
            >
              {/* Importance Indicator */}
              <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-0.5 h-2 rounded-full ${i < concept.importance ? (selectedConceptId === concept.id ? 'bg-cyan-400' : 'bg-slate-500') : 'bg-slate-800'}`}></div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <span className="text-[8px] mono font-bold uppercase tracking-widest text-slate-600 mb-1 block">CONCEPT_NODE</span>
                <h4 className={`text-sm lg:text-base font-bold mono uppercase tracking-tight ${selectedConceptId === concept.id ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {concept.label}
                </h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-serif italic line-clamp-3 mb-4 flex-1">
                "{concept.description}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex -space-x-2">
                  {concept.connections.slice(0, 3).map((conn, idx) => (
                    <div key={idx} className="w-5 h-5 rounded-full border border-slate-900 bg-slate-800 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                    </div>
                  ))}
                  {concept.connections.length > 3 && (
                    <div className="text-[8px] mono text-slate-600 ml-3 flex items-center">+{concept.connections.length - 3}</div>
                  )}
                </div>
                <div className="text-[9px] mono text-slate-600 font-bold tracking-widest uppercase">
                  VIEW_MATRIX
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel - Connections and Full Context */}
      {selectedConcept && (
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0b10] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-black/20">
            <h3 className="mono text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]">NODE_INSPECTOR</h3>
            <button onClick={() => setSelectedConceptId(null)} className="p-1 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-100 mono uppercase tracking-tighter leading-tight">{selectedConcept.label}</h2>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-sm">
                <p className="text-sm text-slate-300 leading-relaxed serif italic">"{selectedConcept.description}"</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[9px] mono font-bold uppercase tracking-[0.4em] text-slate-600">Cross_Matrix_Connections</label>
              <div className="space-y-2">
                {relatedConcepts.length > 0 ? (
                  relatedConcepts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedConceptId(c.id);
                        onConceptClick(c);
                      }}
                      className="w-full text-left p-3 border border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all group flex items-center space-x-3"
                    >
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:animate-ping"></div>
                      <div>
                        <div className="text-[10px] mono font-bold text-slate-400 group-hover:text-cyan-400 uppercase">{c.label}</div>
                        <div className="text-[8px] mono text-slate-700 uppercase tracking-widest">{c.category || 'GENERAL'}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-[10px] mono text-slate-700 italic">No direct connections established in matrix.</div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
               <button className="w-full py-3 bg-cyan-500 text-slate-900 mono text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                INJECT_INTO_DIALOGUE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptMap;
