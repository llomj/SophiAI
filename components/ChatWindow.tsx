import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Message, Persona, Note, CustomPersona, Fallacy } from '../types';
import { PERSONA_CONFIGS } from '../constants';
import { GoogleGenAI, Modality } from "@google/genai";
import { loadApiKey } from '../utils/storage';

interface ChatWindowProps {
  messages: Message[];
  activePersona: string;
  activePersonas?: string[];
  onPersonasChange?: (personas: string[]) => void;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onToggleSidebar?: () => void;
  onOpenSidebar?: () => void;
  activeNote?: Note;
  customPersonas?: CustomPersona[];
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  activePersona,
  activePersonas = [activePersona],
  onPersonasChange,
  onSendMessage, 
  isLoading, 
  onToggleSidebar,
  onOpenSidebar,
  activeNote,
  customPersonas = []
}) => {
  // Check if API key is available
  const userApiKey = loadApiKey();
  const envKey = typeof process !== 'undefined' && process.env ? (process.env.API_KEY || process.env.GEMINI_API_KEY) : null;
  const hasApiKey = userApiKey || (envKey && envKey !== 'null' && envKey !== 'undefined');
  const isInputDisabled = isLoading || !hasApiKey;
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isTtsLoading, setIsTtsLoading] = useState<string | null>(null);
  const [activeFallacies, setActiveFallacies] = useState<Fallacy[] | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join('');
        setInput(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
    return () => {
      if (audioSourceRef.current) audioSourceRef.current.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  const handleSpeak = async (msg: Message) => {
    if (speakingMsgId === msg.id) {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
      setSpeakingMsgId(null);
      return;
    }

    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }

    setIsTtsLoading(msg.id);
    try {
      // Check for user-provided API key first, then fallback to environment variable
      const userApiKey = loadApiKey();
      const apiKey = userApiKey || process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("API Key is missing for TTS!");
        setIsTtsLoading(null);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: msg.content }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
          if (speakingMsgId === msg.id) setSpeakingMsgId(null);
        };
        
        audioSourceRef.current = source;
        setSpeakingMsgId(msg.id);
        setIsTtsLoading(null);
        source.start();
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setIsTtsLoading(null);
      setSpeakingMsgId(null);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading || !hasApiKey) return;
    onSendMessage(input.trim());
    setInput('');
    if (isListening) recognitionRef.current?.stop();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resolvedPersona = useMemo(() => {
    const custom = customPersonas.find(p => p.name === activePersona);
    if (custom) {
      return {
        description: custom.description,
        color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
        focus: []
      };
    }
    return PERSONA_CONFIGS[activePersona] || PERSONA_CONFIGS[Persona.STOIC];
  }, [activePersona, customPersonas]);

  return (
    <div className="flex flex-col h-full bg-[#0d0f17] rounded-none lg:rounded-sm border-0 lg:border lg:border-slate-800 shadow-2xl relative overflow-hidden overflow-x-hidden" style={{ maxWidth: '100%', width: '100%', overflowX: 'hidden' }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2dd4bf 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      {activeFallacies && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a0b10] border border-amber-500/50 p-6 max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.2)] rounded-sm relative">
            <button onClick={() => setActiveFallacies(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h3 className="mono text-amber-400 font-bold uppercase tracking-widest text-sm">Logical_Fallacy_Detected</h3>
                <p className="text-[8px] mono text-slate-600 uppercase tracking-widest">Protocol: REASONING_CHECK_V2</p>
              </div>
            </div>
            <div className="space-y-6 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {activeFallacies.map((f, i) => (
                <div key={i} className="space-y-2 border-l-2 border-amber-500/20 pl-4 py-1">
                  <h4 className="mono text-amber-200 text-xs font-bold uppercase">{f.name}</h4>
                  <p className="text-xs text-slate-400 serif italic leading-relaxed">"{f.definition}"</p>
                  <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-sm">
                    <span className="text-[9px] mono text-amber-500/50 block mb-1 uppercase tracking-tighter">Instance:</span>
                    <p className="text-xs text-slate-500 serif italic">"{f.example}"</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 flex justify-center">
              <button onClick={() => setActiveFallacies(null)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 mono text-[10px] font-bold uppercase tracking-widest transition-all">
                DISMISS_WARNING
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 lg:px-6 py-4 border-b border-slate-800 flex flex-col space-y-2 bg-black/40 backdrop-blur-md z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex items-center space-x-2 min-w-0 flex-1 flex-wrap gap-2">
              {activePersonas.map((persona, idx) => {
                const personaConfig = PERSONA_CONFIGS[persona] || PERSONA_CONFIGS[Persona.TJUMP];
                return (
                  <div key={idx} className="flex items-center space-x-2 px-2 py-1 bg-slate-900/50 border border-slate-700 rounded-sm">
                    <div className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${personaConfig.color.split(' ')[1]}`}></div>
                    <span className="text-xs mono text-slate-300 uppercase tracking-tight truncate max-w-[120px]">{persona}</span>
                    {activePersonas.length > 1 && onPersonasChange && (
                      <button
                        onClick={() => {
                          const newPersonas = activePersonas.filter((_, i) => i !== idx);
                          onPersonasChange(newPersonas.length > 0 ? newPersonas : [activePersona]);
                        }}
                        className="text-slate-500 hover:text-red-400 ml-1"
                        title="Remove persona"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                );
              })}
              {onPersonasChange && (
                <button
                  onClick={() => {
                    // Open sidebar for persona selection (if available, use onOpenSidebar, otherwise toggle)
                    if (onOpenSidebar) {
                      onOpenSidebar();
                    } else if (onToggleSidebar) {
                      // On mobile, toggle will open it
                      if (window.innerWidth < 1024) {
                        onToggleSidebar();
                      }
                      // On desktop, sidebar should already be visible
                    }
                  }}
                  className="px-2 py-1 text-xs mono text-cyan-400 border border-cyan-500/30 rounded-sm hover:bg-cyan-500/10 transition-all"
                  title="Click a persona in the sidebar to add it"
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        </div>
        {activePersonas.length > 1 && (
          <div className="text-[9px] mono text-slate-500 uppercase tracking-wider">
            Multi-persona mode: All selected personas will respond to each message
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 space-y-4 lg:space-y-6 z-10 custom-scrollbar" style={{ maxWidth: '100%', overflowX: 'hidden', paddingBottom: '120px', scrollPaddingBottom: '120px' }}>
        {messages.map((msg) => {
          const isAIVoiceLoading = isTtsLoading === msg.id;
          const isAIVoiceSpeaking = speakingMsgId === msg.id;
          const hasFallacies = msg.metadata?.fallacies && msg.metadata.fallacies.length > 0;
          const hasInconsistency = msg.metadata?.contradictionDetected;

          return (
            <div key={msg.id} className="flex w-full justify-start items-start">
              <div className={`max-w-[95%] lg:max-w-[85%] px-4 py-3 border relative transition-all duration-500 ${
                msg.role === 'user' 
                  ? 'bg-slate-900/80 text-cyan-50 border-cyan-500/20 rounded-sm' 
                  : `bg-black/60 text-slate-300 border-slate-800 rounded-sm ${isAIVoiceSpeaking ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : ''}`
              }`} style={{ marginLeft: 0, marginRight: 'auto' }}>
                
                {msg.role === 'assistant' && (hasFallacies || hasInconsistency) && (
                  <div className="absolute -top-3 left-2 flex space-x-1">
                    {hasInconsistency && (
                      <div className="px-1.5 py-0.5 bg-red-600 text-white text-[7px] lg:text-[8px] mono font-bold rounded-sm shadow-lg uppercase tracking-tighter">
                        INCONSISTENCY
                      </div>
                    )}
                    {hasFallacies && (
                      <button 
                        onClick={() => setActiveFallacies(msg.metadata?.fallacies || null)}
                        className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[7px] lg:text-[8px] mono font-bold rounded-sm shadow-lg uppercase tracking-tighter hover:bg-amber-400 transition-all flex items-center space-x-1"
                      >
                        <span>⚠️ FALLACIES</span>
                      </button>
                    )}
                  </div>
                )}

                {msg.role === 'assistant' && msg.persona && (
                  <div className="mb-2 pb-2 border-b border-slate-700/50">
                    <span className="text-[9px] mono text-cyan-400 uppercase tracking-widest font-bold">{msg.persona}</span>
                  </div>
                )}
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => handleSpeak(msg)}
                    className={`absolute -right-7 lg:-right-8 top-0 p-1 transition-all ${isAIVoiceSpeaking ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    {isAIVoiceLoading ? (
                      <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : isAIVoiceSpeaking ? (
                      <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    )}
                  </button>
                )}

                <div className="text-[13px] lg:text-sm leading-relaxed whitespace-pre-wrap font-light break-words">
                  {msg.content}
                </div>
                <div className={`text-[7px] lg:text-[8px] mt-2 opacity-30 mono tracking-tighter ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black/40 border border-slate-800 px-3 py-2 rounded-sm flex space-x-1.5 items-center">
              <div className="w-1 h-1 bg-cyan-500 rounded-full animate-ping"></div>
              <span className="text-[8px] lg:text-[10px] mono text-slate-500 uppercase tracking-widest">Scanning_Matrix</span>
            </div>
          </div>
        )}
      </div>

      <div className="fixed lg:relative bottom-0 left-0 right-0 lg:bottom-auto pt-3 border-t border-slate-800 bg-[#0a0b10]/95 backdrop-blur-xl z-50 overflow-x-hidden" style={{ width: '100%', maxWidth: '100%', left: 0, right: 0, paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))', position: 'fixed', bottom: 0 }}>
        <div className="flex items-start gap-2 px-4 w-full" style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          <div className="flex-1 min-w-0 relative" style={{ flex: '1 1 0%', minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={isInputDisabled}
              rows={Math.min(4, input.split('\n').length || 1)}
              placeholder={!hasApiKey ? "⚠️ API Key Required - Click 🔑 icon in sidebar" : (isListening ? "LISTENING..." : "SEND_INPUT...")}
              className={`w-full min-w-0 pl-4 pr-10 py-3 bg-[#05060b] border rounded-sm focus:outline-none text-sm mono text-slate-200 resize-none whitespace-pre-wrap leading-relaxed custom-scrollbar ${isListening ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : !hasApiKey ? 'border-amber-500/50' : isInputFocused ? 'border-cyan-500/50 focus:border-cyan-500' : 'border-slate-800'}`}
              style={{ maxWidth: '100%', boxSizing: 'border-box', width: '100%', overflowX: 'hidden', wordWrap: 'break-word', overflowWrap: 'break-word' }}
            />
            <div className="absolute right-2 bottom-2.5 flex items-center pointer-events-none">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-1.5 transition-all flex items-center justify-center rounded-full shrink-0 pointer-events-auto ${isListening ? 'text-cyan-400 bg-cyan-500/10 scale-110 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
                title="Dictation"
              >
                <svg className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !hasApiKey}
            className={`rounded-sm flex items-center justify-center transition-all ${isInputFocused && hasApiKey ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : (!input.trim() || isLoading || !hasApiKey ? 'bg-cyan-500/20 text-cyan-400/30' : 'bg-cyan-500 text-slate-950')} hover:bg-cyan-400 disabled:opacity-20 disabled:grayscale`}
            style={{ width: '48px', minWidth: '48px', maxWidth: '48px', height: '48px', flexShrink: 0, flexGrow: 0, marginTop: '0px' }}
            title={!hasApiKey ? "API Key Required" : ""}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;