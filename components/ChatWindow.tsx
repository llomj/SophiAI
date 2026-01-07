
import React, { useState, useRef, useEffect } from 'react';
import { Message, Persona } from '../types';
import { PERSONA_CONFIGS } from '../constants';

interface ChatWindowProps {
  messages: Message[];
  activePersona: Persona;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onToggleSidebar?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, activePersona, onSendMessage, isLoading, onToggleSidebar }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const persona = PERSONA_CONFIGS[activePersona];

  return (
    <div className="flex flex-col h-full bg-[#0d0f17] rounded-none lg:rounded-sm border-0 lg:border lg:border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2dd4bf 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      {/* Header */}
      <div className="px-4 lg:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-black/40 backdrop-blur-md z-50">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${persona.color.split(' ')[1]}`}></div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-100 text-[11px] lg:text-sm mono tracking-tight leading-tight whitespace-normal break-words">
                {persona.description}
              </h2>
              <p className="text-[9px] text-slate-500 mono uppercase tracking-widest truncate">
                Matrix: <span className={persona.color.split(' ')[1]}>{activePersona}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 z-10 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <div className="w-16 h-16 border border-slate-700 rounded-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.708 0 3.31.425 4.714 1.178m2.191 1.49L18.6 6.51m-10.33 1.15l-1.49-2.191M11 15.5l.001-.001m0 0L11 15.5l.001-.001z" />
              </svg>
            </div>
            <p className="serif text-lg lg:text-xl italic text-slate-400 max-w-xs px-4">
              "The unexamined life is not worth living."
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isContradiction = msg.metadata?.contradictionDetected;
          
          return (
            <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[92%] lg:max-w-[85%] px-4 py-3 lg:px-5 lg:py-3 border relative transition-all duration-500 ${
                msg.role === 'user' 
                  ? 'bg-slate-900/80 text-cyan-50 border-cyan-500/20 rounded-sm rounded-tr-none shadow-[0_0_10px_rgba(6,182,212,0.05)]' 
                  : `bg-black/60 text-slate-300 border-slate-800 rounded-sm rounded-tl-none ${isContradiction ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : ''}`
              }`}>
                {isContradiction && (
                  <div className="absolute -top-2 -left-2 bg-red-500 text-white text-[8px] mono px-2 py-0.5 rounded-full animate-bounce shadow-lg flex items-center space-x-1 z-20">
                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>
                    <span>LOGIC_ERR</span>
                  </div>
                )}
                
                <div className="text-[14px] lg:text-sm leading-relaxed whitespace-pre-wrap font-light break-words">
                  {msg.content.split(/(\[LOGICAL_INCONSISTENCY\])/g).map((part, i) => (
                    part === '[LOGICAL_INCONSISTENCY]' 
                      ? <span key={i} className="text-red-400 font-bold mono bg-red-500/10 px-1 rounded-sm">{part}</span>
                      : <span key={i}>{part}</span>
                  ))}
                </div>

                <div className={`text-[8px] mt-2 opacity-30 mono tracking-tighter ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black/40 border border-slate-800 px-3 py-2 rounded-sm flex space-x-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></div>
              <span className="text-[9px] lg:text-[10px] mono text-slate-500 uppercase tracking-widest">Scanning_Matrix</span>
            </div>
          </div>
        )}
      </div>

      {/* Input - Adjusting for bottom safe area */}
      <form onSubmit={handleSubmit} className="px-4 pt-4 border-t border-slate-800 bg-black/40 z-10 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`SEND_INPUT...`}
            className="w-full pl-4 pr-12 py-4 lg:py-3 bg-[#0a0b10] border border-slate-800 rounded-sm focus:outline-none focus:border-cyan-500/50 transition-all text-sm mono text-slate-200"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-3 bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-20 disabled:grayscale transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] rounded-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
