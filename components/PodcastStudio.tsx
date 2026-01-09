
import React, { useState, useRef, useEffect } from 'react';
import { Persona, Message } from '../types';
import { PERSONA_CONFIGS } from '../constants';
import { GoogleGenAI, Modality } from "@google/genai";

interface PodcastStudioProps {
  onSendMessage: (text: string) => void;
}

// Audio Utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

interface AudioQueueItem {
  buffer: AudioBuffer;
  messages: Message[];
}

const PodcastStudio: React.FC<PodcastStudioProps> = () => {
  const [speakerA, setSpeakerA] = useState<Persona>(Persona.TJUMP);
  const [speakerB, setSpeakerB] = useState<Persona>(Persona.STOIC);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPodcastRunning, setIsPodcastRunning] = useState(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeakerIdx, setActiveSpeakerIdx] = useState<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isStoppingRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const audioQueueRef = useRef<AudioQueueItem[]>([]);
  const processingQueueRef = useRef(false);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isGeneratingNext]);

  // Speech Recognition
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
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  const stopPodcast = () => {
    isStoppingRef.current = true;
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }
    audioQueueRef.current = [];
    setIsPodcastRunning(false);
    setIsGeneratingNext(false);
    setActiveSpeakerIdx(null);
  };

  const fetchNextExchange = async (topic: string, history: Message[]) => {
    if (isStoppingRef.current || audioQueueRef.current.length > 1) return;
    
    setIsGeneratingNext(true);
    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("API Key is missing!");
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      // LARGE CONTEXT: Last 30 messages (~2000 words)
      const recentHistory = history.slice(-30).map(m => {
        const roleName = m.role === 'user' ? 'HOST' : (history.indexOf(m) % 2 === 0 ? speakerA : speakerB);
        return `${roleName}: ${m.content}`;
      }).join("\n");

      const prompt = `
        DEBATE SIMULATION [LONG-FORM MODE]
        Speaker A: ${speakerA} (MALE VOICE, ANALYTIC, BLUNT)
        Speaker B: ${speakerB} (FEMALE VOICE, STOIC, COMPOSED)
        TOPIC: "${topic}"
        CONTEXT (LAST 2000 WORDS): 
        ${recentHistory}

        TASK: Generate a fluid, sharp dialectical exchange.
        - DIRECTIVES: No poetic jargon, no intros. Dive straight into logic.
        - REBUTTAL: Each model must challenge the other's specific previous premises.
        - LOGIC: Actively point out inconsistencies and logical fallacies.
        - TONE: Analytic, human-like, adversarial but intellectually honest.

        OUTPUT FORMAT:
        ${speakerA}: [Concise statement]
        ${speakerB}: [Sharp rebuttal]
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = result.text || "";
      const lines = text.split('\n').filter(l => l.includes(':'));
      const newMsgs: Message[] = [];
      
      lines.forEach(line => {
        const parts = line.split(':');
        const content = parts.slice(1).join(':').trim();
        if (content) {
          newMsgs.push({ id: crypto.randomUUID(), role: 'assistant', content: content.replace(/^["']|["']$/g, ''), timestamp: Date.now() });
        }
      });

      if (newMsgs.length > 0) {
        // Multi-Speaker TTS: Charon (Male) for A, Kore (Female) for B
        const ttsPrompt = `${speakerA}: ${newMsgs[0].content}\n\n${speakerB}: ${newMsgs[1]?.content || ''}`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: ttsPrompt }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  { speaker: speakerA, voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } }, // Male
                  { speaker: speakerB, voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }   // Female
                ]
              }
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
          const buffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
          audioQueueRef.current.push({ buffer, messages: newMsgs });
        }
      }
      setIsGeneratingNext(false);
      
      // Start processing the queue if not already doing so
      if (!processingQueueRef.current && isPodcastRunning) processAudioQueue(topic, history);
    } catch (err) {
      console.error(err);
      setIsGeneratingNext(false);
    }
  };

  const processAudioQueue = async (topic: string, history: Message[]) => {
    if (processingQueueRef.current || isStoppingRef.current || audioQueueRef.current.length === 0) return;
    
    processingQueueRef.current = true;
    const item = audioQueueRef.current.shift()!;
    
    // UI Update
    setMessages(prev => [...prev, ...item.messages]);
    const updatedHistory = [...history, ...item.messages];

    // Playback
    const ctx = audioContextRef.current!;
    const source = ctx.createBufferSource();
    source.buffer = item.buffer;
    source.connect(ctx.destination);
    currentSourceRef.current = source;

    await new Promise((resolve) => {
      source.onended = resolve;
      source.start();
      
      // Visual highlights
      setActiveSpeakerIdx(0);
      const firstRatio = item.messages[0].content.length / (item.messages[0].content.length + (item.messages[1]?.content.length || 0));
      setTimeout(() => { if (!isStoppingRef.current) setActiveSpeakerIdx(1); }, item.buffer.duration * 1000 * firstRatio);
    });

    currentSourceRef.current = null;
    setActiveSpeakerIdx(null);
    processingQueueRef.current = false;

    // Trigger next fetch if queue is low
    if (isPodcastRunning && !isStoppingRef.current) {
      fetchNextExchange(topic, updatedHistory);
      processAudioQueue(topic, updatedHistory);
    }
  };

  const handleAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const topic = input;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: topic, timestamp: Date.now() };
    
    if (!isPodcastRunning) {
      setMessages([userMsg]);
      setIsPodcastRunning(true);
      isStoppingRef.current = false;
      setInput('');
      fetchNextExchange(topic, [userMsg]);
    } else {
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      // Context will be picked up in next background fetch loop
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#030407] relative overflow-hidden font-mono">
      {/* Neural Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#2dd4bf 1px, transparent 1px), linear-gradient(90deg, #2dd4bf 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      {/* Simplified Industrial Header - Optimized for Small Selector Panels */}
      <div className="border-b border-slate-900 bg-black/80 backdrop-blur-xl z-30 shrink-0">
        <div className="px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-6 lg:space-x-12">
            <div className="flex -space-x-4 items-center shrink-0">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-all duration-500 relative ${activeSpeakerIdx === 0 ? 'border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.3)] scale-110 z-10' : 'border-slate-800'}`}>
                <span className="text-[10px] font-bold text-cyan-400">A</span>
                {activeSpeakerIdx === 0 && <div className="absolute -bottom-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>}
              </div>
              <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-all duration-500 relative ${activeSpeakerIdx === 1 ? 'border-pink-500 shadow-[0_0_40px_rgba(244,114,182,0.3)] scale-110 z-10' : 'border-slate-800'}`}>
                <span className="text-[10px] font-bold text-pink-400">B</span>
                {activeSpeakerIdx === 1 && <div className="absolute -bottom-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>}
              </div>
            </div>

            {/* Compact Selector Container */}
            <div className="flex items-center space-x-2">
              <select 
                value={speakerA} 
                onChange={(e) => setSpeakerA(e.target.value as Persona)} 
                className="w-24 lg:w-32 bg-slate-900 border border-slate-800 text-[9px] p-1.5 text-cyan-400 outline-none hover:border-cyan-500 transition-colors uppercase tracking-tight truncate rounded-sm"
              >
                {Object.keys(PERSONA_CONFIGS).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="text-slate-800 text-[10px]">VS</span>
              <select 
                value={speakerB} 
                onChange={(e) => setSpeakerB(e.target.value as Persona)} 
                className="w-24 lg:w-32 bg-slate-900 border border-slate-800 text-[9px] p-1.5 text-pink-400 outline-none hover:border-pink-500 transition-colors uppercase tracking-tight truncate rounded-sm"
              >
                {Object.keys(PERSONA_CONFIGS).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isPodcastRunning && (
              <button onClick={stopPodcast} className="px-4 py-2 bg-red-950/20 text-red-500 border border-red-900 text-[9px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                STOP
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Infinite Dialogue Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-10 lg:space-y-12 custom-scrollbar z-10 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
             <div className="text-[10px] tracking-[1em] mb-4 uppercase">Neural_Awaiting_Seed</div>
             <div className="w-px h-20 bg-gradient-to-b from-cyan-500 to-transparent"></div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          const isSpkA = !isUser && (i - messages.findIndex(m => m.id === msg.id && m.role !== 'user')) % 2 === 0;
          const pName = isUser ? 'HOST' : (isSpkA ? speakerA : speakerB);
          const pColor = isSpkA ? 'text-cyan-400' : (isUser ? 'text-white' : 'text-pink-400');
          const pActive = (isSpkA && activeSpeakerIdx === 0) || (!isSpkA && !isUser && activeSpeakerIdx === 1);

          return (
            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-center py-6' : 'justify-start animate-in fade-in duration-1000'}`}>
              <div className={`relative transition-all duration-700 ${pActive ? 'scale-[1.01]' : 'opacity-70'} ${isUser ? 'w-full' : 'max-w-[85%]'}`}>
                {isUser ? (
                  <div className="text-center py-6 lg:py-8 border-y border-slate-900 bg-slate-950/40 px-4">
                    <span className="text-[8px] text-cyan-500 tracking-[0.5em] block mb-2 uppercase">DIALECTIC_PROPOSITION</span>
                    <h1 className="text-lg lg:text-2xl font-bold text-slate-200 italic">"{msg.content}"</h1>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${pColor}`}>
                      {pName} {pActive && <span className="animate-pulse ml-4">[ON_AIR]</span>}
                    </span>
                    <div className={`p-5 lg:p-6 border-l border-slate-800 bg-black/40 text-slate-300 transition-all ${pActive ? 'border-cyan-500/50 bg-slate-900/10' : ''}`}>
                      <p className="text-sm lg:text-base leading-relaxed serif italic">"{msg.content}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isGeneratingNext && (
          <div className="flex justify-start">
            <div className="text-[9px] text-slate-700 tracking-widest uppercase flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></div>
              <span>Neural_Buffer_Streaming...</span>
            </div>
          </div>
        )}
      </div>

      {/* Industrial Command Input */}
      <div className="p-4 lg:p-10 border-t border-slate-900 bg-black z-30">
        <form onSubmit={handleAction} className="relative max-w-5xl mx-auto flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "LISTENING..." : "SEND_INSTRUCTION..."}
              className={`w-full bg-slate-950 border border-slate-900 p-4 lg:p-5 text-sm text-slate-200 focus:outline-none focus:border-cyan-900 transition-all rounded-sm ${isListening ? 'border-red-900' : ''}`}
            />
            <div className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 lg:space-x-4">
              <button type="button" onClick={toggleListening} className={`p-2 rounded-sm transition-all ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-600 hover:text-cyan-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
              <button type="submit" disabled={!input.trim()} className="px-4 lg:px-6 py-2 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400 disabled:opacity-10 transition-all rounded-sm">
                {isPodcastRunning ? 'CHIME' : 'GO'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PodcastStudio;
