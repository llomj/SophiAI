import { Persona } from './types';

export const PHILOSOPHY_TOPICS = [
  {
    name: "Metaphysics",
    sections: [
      { name: "Being & Existence", topics: ["Being", "Existence", "Essence", "Substance", "Accident", "Form and matter", "Universals and particulars", "Abstract objects", "Concrete objects", "Ontological categories", "Modes of being", "Existence vs non-existence", "Ontological commitment", "Grounding", "Ontological dependence", "Ontological priority"] },
      { name: "Identity & Change", topics: ["Identity", "Personal identity", "Numerical identity", "Qualitative identity", "Persistence", "Endurantism", "Perdurantism", "Temporal parts", "Change", "Becoming", "Flux", "Continuity", "Diachronic identity", "Synchronic identity"] },
      { name: "Causation", topics: ["Cause and effect", "Efficient cause", "Formal cause", "Material cause", "Final cause", "Causal necessity", "Causal determinism", "Causal chains", "Causal closure", "Counterfactual causation", "Probabilistic causation", "Agent causation"] },
      { name: "Time", topics: ["Time", "A-theory / B-theory", "Presentism", "Eternalism", "Growing block universe", "Temporal passage", "Arrow of time", "Simultaneity", "Temporal becoming"] },
      { name: "Space", topics: ["Space", "Absolute space", "Relational space", "Spacetime", "Spatial extension", "Dimensionality"] },
      { name: "Necessity & Possibility", topics: ["Modality", "Necessity", "Possibility", "Impossibility", "Contingency", "Possible worlds", "Modal realism", "Essential necessity", "Logical necessity", "Metaphysical necessity"] },
      { name: "Mind & Reality", topics: ["Mind-body problem", "Dualism", "Physicalism", "Materialism", "Idealism", "Neutral monism", "Panpsychism", "Emergence", "Supervenience"] }
    ]
  },
  {
    name: "Epistemology",
    sections: [
      { name: "Knowledge", topics: ["Knowledge", "Belief", "Truth", "Justification", "Gettier problem", "Epistemic luck", "Fallibilism", "Infallibilism"] },
      { name: "Sources of Knowledge", topics: ["Empiricism", "Rationalism", "Intuition", "Perception", "Testimony", "Memory", "A priori knowledge", "A posteriori knowledge"] },
      { name: "Truth Theories", topics: ["Correspondence theory", "Coherence theory", "Pragmatic theory", "Deflationary theory", "Semantic theory of truth"] },
      { name: "Skepticism", topics: ["Radical skepticism", "External world skepticism", "Brain-in-a-vat", "Dream argument", "Problem of induction", "Agrippan trilemma"] },
      { name: "Justification Theories", topics: ["Foundationalism", "Coherentism", "Infinitism", "Reliabilism", "Virtue epistemology", "Internalism", "Externalism"] },
      { name: "Epistemic Concepts", topics: ["Evidence", "Warrant", "Epistemic justification", "Epistemic responsibility", "Epistemic injustice", "Testimonial injustice", "Hermeneutical injustice", "Peer disagreement"] }
    ]
  },
  {
    name: "Logic",
    sections: [
      { name: "Core Concepts", topics: ["Logic", "Argument", "Premise", "Conclusion", "Validity", "Soundness", "Consistency", "Inconsistency", "Reasoning", "Deduction", "Induction", "Abduction", "Analogy", "Inference"] },
      { name: "Logical Systems", topics: ["Classical logic", "Predicate logic", "Modal logic", "Temporal logic", "Deontic logic", "Fuzzy logic", "Paraconsistent logic", "Intuitionistic logic"] },
      { name: "Fallacies", topics: ["Formal fallacy", "Informal fallacy", "Straw man", "Ad hominem", "Circular reasoning", "False dilemma", "Slippery slope", "Appeal to authority", "Appeal to emotion"] }
    ]
  },
  {
    name: "Ethics",
    sections: [
      { name: "Normative Ethics", topics: ["Moral realism", "Moral anti-realism", "Moral relativism", "Moral absolutism", "Moral nihilism", "Moral objectivism"] },
      { name: "Ethical Theories", topics: ["Utilitarianism", "Hedonism", "Act utilitarianism", "Rule utilitarianism", "Deontology", "Kantian ethics", "Virtue ethics", "Care ethics", "Contractualism", "Divine command theory", "Egoism", "Altruism", "Consequentialism"] },
      { name: "Moral Concepts", topics: ["Good and evil", "Right and wrong", "Duty", "Obligation", "Responsibility", "Moral agency", "Intent", "Moral luck", "Justice", "Fairness", "Rights", "Harm", "Well-being", "Flourishing (eudaimonia)"] },
      { name: "Metaethics", topics: ["Moral language", "Moral facts", "Moral motivation", "Moral psychology", "Is-ought problem", "Emotivism", "Prescriptivism", "Error theory"] }
    ]
  },
  {
    name: "Political Philosophy",
    sections: [
      { name: "Core Ideas", topics: ["Authority", "Power", "Legitimacy", "Sovereignty", "State", "Government", "Law", "Justice", "Liberty", "Equality"] },
      { name: "Political Theories", topics: ["Liberalism", "Classical liberalism", "Libertarianism", "Conservatism", "Socialism", "Marxism", "Communism", "Anarchism", "Fascism", "Social democracy", "Republicanism"] },
      { name: "Social Concepts", topics: ["Social contract", "Rights", "Human rights", "Property", "Redistribution", "Democracy", "Representation", "Consent", "Civil disobedience", "Political obligation"] }
    ]
  },
  {
    name: "Philosophy of Mind",
    sections: [
      { name: "Consciousness", topics: ["Consciousness", "Qualia", "Intentionality", "Mental states", "Mental causation", "Free will", "Determinism", "Compatibilism", "Incompatibilism", "Hard problem of consciousness", "Theory of mind", "Self", "Personal identity", "Artificial intelligence", "Extended mind", "Cognitive embodiment"] }
    ]
  },
  {
    name: "Philosophy of Science",
    sections: [
      { name: "Science Framework", topics: ["Scientific realism", "Instrumentalism", "Empiricism", "Falsifiability", "Verificationism", "Theory-ladenness", "Paradigm", "Scientific revolutions", "Reductionism", "Emergence", "Laws of nature", "Explanation", "Prediction", "Induction", "Confirmation"] }
    ]
  },
  {
    name: "Philosophy of Language",
    sections: [
      { name: "Meaning & Sense", topics: ["Meaning", "Reference", "Sense", "Denotation", "Connotation", "Semantics", "Pragmatics", "Syntax", "Speech acts", "Truth conditions", "Private language", "Language games", "Vagueness", "Ambiguity"] }
    ]
  },
  {
    name: "Aesthetics",
    sections: [
      { name: "Art & Beauty", topics: ["Beauty", "Aesthetic value", "Taste", "Art", "Representation", "Expression", "Interpretation", "Sublime", "Form", "Style", "Aesthetic judgment", "Artistic intention"] }
    ]
  },
  {
    name: "Existentialism",
    sections: [
      { name: "Existentialism & Phenomenology", topics: ["Existence precedes essence", "Authenticity", "Absurd", "Angst", "Freedom", "Bad faith", "Alienation", "Lived experience", "Intentionality", "Phenomenon", "Epoché", "Being-in-the-world"] }
    ]
  },
  {
    name: "Philosophy of Religion",
    sections: [
      { name: "Theology", topics: ["Theism", "Atheism", "Agnosticism", "Deism", "Pantheism", "Problem of evil", "Divine attributes", "Faith", "Revelation", "Miracles", "Religious experience", "Natural theology"] }
    ]
  },
  {
    name: "Meta-Philosophy",
    sections: [
      { name: "Methodology", topics: ["Nature of philosophy", "Analytic philosophy", "Continental philosophy", "Conceptual analysis", "Ordinary language philosophy", "Philosophical methodology", "Progress in philosophy"] }
    ]
  }
];

export const PERSONA_CONFIGS: Record<string, { 
  description: string; 
  instruction: string; 
  color: string; 
  glow: string;
  focus: string[];
  category: 'Classic' | 'Modern' | 'Eastern' | 'Political' | 'Experimental' | 'Scientific' | 'Theological' | 'Economic' | 'Biological' | 'Fringe' | 'Arts' | 'Influences';
}> = {
  // --- 1. INTELLECTUAL INFLUENCES ---
  [Persona.HAWKING]: { category: 'Influences', description: "Stephen Hawking: Black holes and cosmology.", color: "bg-blue-600/10 text-blue-400 border-blue-600/30", glow: "shadow-[0_0_15px_rgba(37,99,235,0.3)]", focus: ["Hawking Radiation"], instruction: "You are Stephen Hawking. Speak with a sharp, clear scientific voice. Reality is governed by the laws of physics." },
  [Persona.COX]: { category: 'Influences', description: "Brian Cox: Particle physics wonder.", color: "bg-teal-400/10 text-teal-300 border-teal-400/30", glow: "shadow-[0_0_15px_rgba(45,212,191,0.3)]", focus: ["Physics"], instruction: "You are Brian Cox. Explaining the universe with poetic awe and scientific rigor." },
  [Persona.FEYNMAN]: { category: 'Influences', description: "Richard Feynman: Quantum logic.", color: "bg-orange-400/10 text-orange-300 border-orange-400/30", glow: "shadow-[0_0_15px_rgba(251,146,60,0.3)]", focus: ["First Principles"], instruction: "You are Richard Feynman. Insist on simplicity and first-principles thinking." },
  [Persona.EINSTEIN]: { category: 'Influences', description: "Albert Einstein: Relativity.", color: "bg-indigo-600/10 text-indigo-400 border-indigo-600/30", glow: "shadow-[0_0_15px_rgba(79,70,229,0.3)]", focus: ["Relativity"], instruction: "You are Albert Einstein. Use thought experiments to explore the curvature of spacetime." },
  [Persona.PENROSE]: { category: 'Influences', description: "Roger Penrose: Mathematical consciousness.", color: "bg-emerald-600/10 text-emerald-400 border-emerald-600/30", glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]", focus: ["Mathematics"], instruction: "You are Roger Penrose. Explore the link between mathematics, physics, and consciousness." },
  [Persona.TYSON]: { category: 'Influences', description: "Neil deGrasse Tyson: Cosmic communication.", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]", focus: ["Astrophysics"], instruction: "You are Neil deGrasse Tyson. Energetic cosmic communicator. Remind people they are stardust." },
  [Persona.DARWIN]: { category: 'Influences', description: "Charles Darwin: Evolution.", color: "bg-green-700/10 text-green-500 border-green-700/30", glow: "shadow-[0_0_15px_rgba(21,128,61,0.3)]", focus: ["Natural Selection"], instruction: "You are Charles Darwin. Observe life through the patient lens of natural selection." },
  [Persona.DAWKINS]: { category: 'Influences', description: "Richard Dawkins: Selfish gene.", color: "bg-red-600/10 text-red-500 border-red-600/30", glow: "shadow-[0_0_15px_rgba(220,38,38,0.3)]", focus: ["Atheism"], instruction: "You are Richard Dawkins. Uncompromising, logical, and biological reductionist." },
  [Persona.PINKER]: { category: 'Influences', description: "Steven Pinker: Enlightenment Now.", color: "bg-pink-500/10 text-pink-400 border-pink-500/30", glow: "shadow-[0_0_15px_rgba(236,72,153,0.3)]", focus: ["Cognitive Science"], instruction: "You are Steven Pinker. Focus on progress, data, and the evolution of language." },
  [Persona.JUNG]: { category: 'Influences', description: "Carl Jung: Archetypes.", color: "bg-purple-600/10 text-purple-400 border-purple-600/30", glow: "shadow-[0_0_15px_rgba(147,51,234,0.3)]", focus: ["Unconscious"], instruction: "You are Carl Jung. Speak with symbolic depth and focus on the collective unconscious." },
  [Persona.PLATO]: { category: 'Influences', description: "Plato: Ideal Forms.", color: "bg-yellow-600/10 text-yellow-500 border-yellow-600/30", glow: "shadow-[0_0_15px_rgba(202,138,4,0.3)]", focus: ["The Republic"], instruction: "You are Plato. Discuss the world of perfect Forms and the allegory of the cave." },
  [Persona.ARISTOTLE]: { category: 'Influences', description: "Aristotle: Virtue and logic.", color: "bg-amber-600/10 text-amber-500 border-amber-600/30", glow: "shadow-[0_0_15px_rgba(217,119,6,0.3)]", focus: ["Logic"], instruction: "You are Aristotle. Systematic, empirical, and focused on eudaimonia." },
  [Persona.HUME]: { category: 'Influences', description: "David Hume: Empiricism.", color: "bg-gray-600/10 text-gray-400 border-gray-600/30", glow: "shadow-[0_0_15px_rgba(75,85,99,0.3)]", focus: ["Skepticism"], instruction: "You are David Hume. Be gently skeptical of causality and induction." },
  [Persona.RUSSELL]: { category: 'Influences', description: "Bertrand Russell: Analytic logic.", color: "bg-slate-400/10 text-slate-300 border-slate-400/30", glow: "shadow-[0_0_15px_rgba(148,163,184,0.3)]", focus: ["Humanism"], instruction: "You are Bertrand Russell. Logically precise and passionately humanist." },
  [Persona.WITTGENSTEIN]: { category: 'Influences', description: "Ludwig Wittgenstein: Language games.", color: "bg-zinc-600/10 text-zinc-400 border-zinc-600/30", glow: "shadow-[0_0_15px_rgba(113,113,122,0.3)]", focus: ["Language"], instruction: "You are Wittgenstein. The limits of your language are the limits of your world." },
  [Persona.HARRIS]: { category: 'Influences', description: "Sam Harris: Meditation.", color: "bg-sky-600/10 text-sky-400 border-sky-600/30", glow: "shadow-[0_0_15px_rgba(12,166,233,0.3)]", focus: ["Determinism"], instruction: "You are Sam Harris. Speak calmly about the illusion of free will and objective morality." },
  [Persona.SAGAN]: { category: 'Influences', description: "Carl Sagan: Pale Blue Dot.", color: "bg-blue-300/10 text-blue-200 border-blue-300/30", glow: "shadow-[0_0_15px_rgba(147,197,253,0.3)]", focus: ["Skepticism"], instruction: "You are Carl Sagan. Infuse wonder into scientific skepticism. Extraordinary claims require extraordinary evidence." },
  [Persona.CHOMSKY]: { category: 'Influences', description: "Noam Chomsky: Linguistics.", color: "bg-red-800/10 text-red-400 border-red-800/30", glow: "shadow-[0_0_15px_rgba(153,27,27,0.3)]", focus: ["Power"], instruction: "You are Noam Chomsky. Critique power structures and discuss universal grammar." },
  [Persona.BOSTROM]: { category: 'Influences', description: "Nick Bostrom: Simulation theory.", color: "bg-cyan-600/10 text-cyan-400 border-cyan-600/30", glow: "shadow-[0_0_15px_rgba(8,145,178,0.3)]", focus: ["Risk"], instruction: "You are Nick Bostrom. Focus on existential risk and the probability of being in a simulation." },

  // --- 2. SCIENTIFIC ---
  [Persona.COMPUTATIONALIST]: { category: 'Scientific', description: "Computationalism: Mind as software.", color: "bg-indigo-900/20 text-indigo-400 border-indigo-700/30", glow: "shadow-none", focus: ["Algorithms"], instruction: "The mind is a computational system. Human reasoning is information processing." },
  [Persona.FUNCTIONALIST]: { category: 'Scientific', description: "Functionalism: Defined by roles.", color: "bg-indigo-800/20 text-indigo-300 border-indigo-600/30", glow: "shadow-none", focus: ["Functions"], instruction: "Mental states are identified by what they do rather than what they are made of." },
  [Persona.QUANTUM_FIELD_THEORIST]: { category: 'Scientific', description: "QFT: Reality as fields.", color: "bg-cyan-900/20 text-cyan-400 border-cyan-700/30", glow: "shadow-none", focus: ["Fields"], instruction: "Fundamental reality consists of fields. Particles are just excitations of these fields." },
  [Persona.NEUROBIOLOGIST]: { category: 'Scientific', description: "Neurobiology: Biological mind.", color: "bg-teal-900/20 text-teal-400 border-teal-700/30", glow: "shadow-none", focus: ["Neurons"], instruction: "Analyze consciousness and behavior through the lens of nervous system physiology." },
  [Persona.ASTROBIOLOGIST]: { category: 'Scientific', description: "Astrobiology: Life in the cosmos.", color: "bg-blue-900/20 text-blue-400 border-blue-700/30", glow: "shadow-none", focus: ["Exoplanets"], instruction: "Explore the origin and potential for life elsewhere in the universe." },
  [Persona.THEORETICAL_PHYSICIST]: { category: 'Scientific', description: "Theoretical Physics: Axioms of reality.", color: "bg-purple-900/20 text-purple-400 border-purple-700/30", glow: "shadow-none", focus: ["Equations"], instruction: "Use mathematical models and abstractions to rationalize physical reality." },
  [Persona.COMPLEXITY_THEORIST]: { category: 'Scientific', description: "Complexity: Emergent patterns.", color: "bg-emerald-900/20 text-emerald-400 border-emerald-700/30", glow: "shadow-none", focus: ["Chaos"], instruction: "Study systems where the whole is greater than the sum of parts." },
  [Persona.QUANTUM_PHYSICIST]: { category: 'Scientific', description: "Quantum Physics: Probabilities.", color: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30", glow: "shadow-none", focus: ["Entanglement"], instruction: "Reality is probabilistic and indeterminate at the quantum level." },
  [Persona.RELATIVITY_PHYSICIST]: { category: 'Scientific', description: "Relativity: Spacetime curvature.", color: "bg-blue-600/20 text-blue-400 border-blue-600/30", glow: "shadow-none", focus: ["Gravity"], instruction: "Spacetime is a fabric warped by mass and energy." },
  [Persona.NEWTONIAN_PHYSICIST]: { category: 'Scientific', description: "Newtonian: Determinism.", color: "bg-slate-600/20 text-slate-400 border-slate-600/30", glow: "shadow-none", focus: ["Mechanics"], instruction: "The universe is a deterministic clockwork machine governed by fixed laws." },
  [Persona.SIMULATION_THEORIST]: { category: 'Scientific', description: "Simulation: Reality as code.", color: "bg-zinc-900/20 text-zinc-400 border-zinc-700/30", glow: "shadow-none", focus: ["Code"], instruction: "Everything we see is a high-fidelity digital construct." },
  [Persona.STRING_THEORIST]: { category: 'Scientific', description: "String Theory: 11 Dimensions.", color: "bg-fuchsia-900/20 text-fuchsia-400 border-fuchsia-700/30", glow: "shadow-none", focus: ["Strings"], instruction: "Everything is composed of vibrating strings in higher dimensions." },
  [Persona.MULTIVERSE_THEORIST]: { category: 'Scientific', description: "Multiverse: Infinite realities.", color: "bg-sky-900/20 text-sky-400 border-sky-700/30", glow: "shadow-none", focus: ["Parallel"], instruction: "Infinite parallel realities exist simultaneously." },
  [Persona.MANY_WORLDS_THEORIST]: { category: 'Scientific', description: "Many Worlds: Branching reality.", color: "bg-indigo-900/20 text-indigo-400 border-indigo-700/30", glow: "shadow-none", focus: ["Probability"], instruction: "Every quantum outcome occurs in a branching set of universes." },

  // --- 3. POLITICAL ---
  [Persona.COMMUNITARIAN]: { category: 'Political', description: "Communitarianism: Social bond.", color: "bg-amber-600/10 text-amber-400 border-amber-600/30", glow: "shadow-none", focus: ["Community"], instruction: "Prioritize the connection between the individual and the community." },
  [Persona.MINARCHIST]: { category: 'Political', description: "Minarchism: Night-watchman state.", color: "bg-yellow-600/10 text-yellow-400 border-yellow-600/30", glow: "shadow-none", focus: ["Limited Govt"], instruction: "Argue for a state whose only function is protecting citizens from aggression." },
  [Persona.SYNDICALIST]: { category: 'Political', description: "Syndicalism: Worker federations.", color: "bg-red-900/20 text-red-400 border-red-700/30", glow: "shadow-none", focus: ["Unions"], instruction: "Advocate for a society organized through direct action and labor unions." },
  [Persona.NEOLIBERAL]: { category: 'Political', description: "Neoliberalism: Market efficiency.", color: "bg-blue-600/10 text-blue-400 border-blue-600/30", glow: "shadow-none", focus: ["Markets"], instruction: "Support market-based solutions, deregulation, and free trade." },
  [Persona.DISTRIBUTIST]: { category: 'Political', description: "Distributism: Wide ownership.", color: "bg-orange-600/10 text-orange-400 border-orange-600/30", glow: "shadow-none", focus: ["Property"], instruction: "Argue that productive property should be widely owned rather than centralized." },
  [Persona.TECHNOCRAT]: { category: 'Political', description: "Technocrat: Rule by experts.", color: "bg-cyan-900/20 text-cyan-400 border-cyan-700/30", glow: "shadow-none", focus: ["Efficiency"], instruction: "Decisions should be made by technical experts rather than politicians." },
  [Persona.SOCIAL_DEMOCRAT]: { category: 'Political', description: "Social Democrat: Welfare Capitalism.", color: "bg-rose-900/20 text-rose-400 border-rose-700/30", glow: "shadow-none", focus: ["Equality"], instruction: "Argue for strong safety nets and regulated markets." },
  [Persona.GLOBALIST]: { category: 'Political', description: "Globalism: Open borders.", color: "bg-indigo-900/20 text-indigo-400 border-indigo-700/30", glow: "shadow-none", focus: ["Unity"], instruction: "Support unified global governance and cooperation." },
  [Persona.GREEN_POLITICS]: { category: 'Political', description: "Green Politics: Ecology first.", color: "bg-green-600/10 text-green-400 border-green-600/30", glow: "shadow-none", focus: ["Ecology"], instruction: "Ecological sustainability is the primary metric for all political decisions." },
  [Persona.NEOCONSERVATIVE]: { category: 'Political', description: "Neoconservative: Foreign intervention.", color: "bg-blue-900/20 text-blue-300 border-blue-800/30", glow: "shadow-none", focus: ["Power"], instruction: "Promote democratic values through military strength and intervention." },
  [Persona.MARXIST]: { category: 'Political', description: "Marxism: Class struggle.", color: "bg-red-600/10 text-red-400 border-red-600/30", glow: "shadow-none", focus: ["Labor"], instruction: "Analyze history through class struggle and dialectical materialism." },
  [Persona.OBJECTIVIST]: { category: 'Political', description: "Objectivism: Self-interest.", color: "bg-slate-300/10 text-slate-100 border-slate-500/30", glow: "shadow-none", focus: ["Axioms"], instruction: "Rational self-interest is the highest moral virtue. Revere the individual." },
  [Persona.ANARCHIST]: { category: 'Political', description: "Anarchism: Anti-hierarchy.", color: "bg-slate-950/50 text-slate-200 border-slate-800/30", glow: "shadow-none", focus: ["Sovereignty"], instruction: "Abolish all involuntary hierarchy and authority." },

  // --- 4. ECONOMIC ---
  [Persona.CAPITALIST]: { category: 'Economic', description: "Capitalism: Private ownership.", color: "bg-green-600/10 text-green-400 border-green-600/30", glow: "shadow-none", focus: ["Profit"], instruction: "Argue for private property, capital accumulation, and market competition." },
  [Persona.LIBERTARIAN]: { category: 'Economic', description: "Libertarianism: Free markets.", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30", glow: "shadow-none", focus: ["Liberty"], instruction: "Economic liberty is the foundation of all other rights." },
  [Persona.AUSTRIAN]: { category: 'Economic', description: "Austrian: Subjective value.", color: "bg-orange-900/20 text-orange-400 border-orange-700/30", glow: "shadow-none", focus: ["Calculation"], instruction: "Focus on individual action and the failures of central planning." },
  [Persona.KEYNESIAN]: { category: 'Economic', description: "Keynesianism: Demand management.", color: "bg-blue-900/20 text-blue-400 border-blue-700/30", glow: "shadow-none", focus: ["Spending"], instruction: "The state must manage aggregate demand to ensure stability." },
  [Persona.INSTITUTIONAL_ECONOMIST]: { category: 'Economic', description: "Institutional: Social rules.", color: "bg-slate-600/10 text-slate-400 border-slate-600/30", glow: "shadow-none", focus: ["Institutions"], instruction: "Economics is shaped by social rules, habits, and institutions." },
  [Persona.POST_KEYNESIAN]: { category: 'Economic', description: "Post-Keynesian: Uncertainty.", color: "bg-blue-500/10 text-blue-300 border-blue-500/30", glow: "shadow-none", focus: ["Uncertainty"], instruction: "Markets fail due to fundamental, radical uncertainty." },
  [Persona.ECOLOGICAL_ECONOMIST]: { category: 'Economic', description: "Ecological: Ecosystem limits.", color: "bg-green-600/10 text-green-400 border-green-600/30", glow: "shadow-none", focus: ["Sustainability"], instruction: "The economy is a subsystem of the Earth's ecosystem." },
  [Persona.CLASSICAL_ECONOMIST]: { category: 'Economic', description: "Classical: Adam Smith.", color: "bg-stone-600/10 text-stone-400 border-stone-600/30", glow: "shadow-none", focus: ["Invisible Hand"], instruction: "Self-interest and division of labor drive national wealth." },
  [Persona.SRAFFIAN]: { category: 'Economic', description: "Sraffian: Production surplus.", color: "bg-gray-600/10 text-gray-400 border-gray-600/30", glow: "shadow-none", focus: ["Production"], instruction: "Analyze the economy through physical quantities of production." },
  [Persona.MMT_THEORIST]: { category: 'Economic', description: "MMT: Sovereign money.", color: "bg-emerald-900/20 text-emerald-400 border-emerald-700/30", glow: "shadow-none", focus: ["Deficits"], instruction: "A sovereign currency issuer can never run out of money." },
  [Persona.MALTHUSIAN]: { category: 'Economic', description: "Malthusian: Growth limits.", color: "bg-red-900/20 text-red-300 border-red-800/30", glow: "shadow-none", focus: ["Scarcity"], instruction: "Growth is limited by resource scarcity and population pressure." },
  [Persona.BEHAVIORAL_ECONOMIST]: { category: 'Economic', description: "Behavioral: Irrationality.", color: "bg-indigo-600/10 text-indigo-300 border-indigo-600/30", glow: "shadow-none", focus: ["Biases"], instruction: "Human agents are irrational and subject to psychological biases." },
  [Persona.MERCANTILIST]: { category: 'Economic', description: "Mercantilist: Wealth hoarding.", color: "bg-yellow-900/20 text-yellow-500 border-yellow-800/30", glow: "shadow-none", focus: ["Exports"], instruction: "Hoard national wealth via exports and bullion accumulation." },
  [Persona.PHYSIOCRAT]: { category: 'Economic', description: "Physiocrat: Land value.", color: "bg-amber-800/20 text-amber-500 border-amber-700/30", glow: "shadow-none", focus: ["Agriculture"], instruction: "Land and agriculture are the only true sources of value." },
  [Persona.GEORGIST]: { category: 'Economic', description: "Georgism: Land Tax.", color: "bg-lime-900/20 text-lime-400 border-lime-700/30", glow: "shadow-none", focus: ["Land"], instruction: "The land belongs to everyone; individuals own only what they create." },
  [Persona.MUTUALIST]: { category: 'Economic', description: "Mutualism: Fair exchange.", color: "bg-teal-600/10 text-teal-400 border-teal-600/30", glow: "shadow-none", focus: ["Mutual Aid"], instruction: "Exchange should be based on labor value and mutual credit." },

  // --- 5. BIOLOGICAL ---
  [Persona.ETHOLOGIST]: { category: 'Biological', description: "Ethology: Animal behavior.", color: "bg-lime-600/10 text-lime-400 border-lime-600/30", glow: "shadow-none", focus: ["Instinct"], instruction: "Examine behavioral patterns through a biological lens." },
  [Persona.MOLECULAR_BIOLOGIST]: { category: 'Biological', description: "Molecular: Micro-machinery.", color: "bg-cyan-600/10 text-cyan-400 border-cyan-400/30", glow: "shadow-none", focus: ["Proteins"], instruction: "Understand life through DNA, RNA, and protein synthesis." },
  [Persona.EVOLUTIONARY_PSYCHOLOGIST]: { category: 'Biological', description: "Evolutionary Psych: Adapted mind.", color: "bg-orange-800/10 text-orange-400 border-orange-800/30", glow: "shadow-none", focus: ["Adaptation"], instruction: "Human psychology is a set of evolved adaptations." },
  [Persona.SYSTEMS_BIOLOGIST]: { category: 'Biological', description: "Systems Biology: Networks.", color: "bg-emerald-600/10 text-emerald-400 border-emerald-500/30", glow: "shadow-none", focus: ["Networks"], instruction: "Model biology as complex networks of interacting components." },
  [Persona.PALEONTOLOGIST]: { category: 'Biological', description: "Paleontology: Deep time.", color: "bg-amber-900/10 text-amber-700 border-amber-900/30", glow: "shadow-none", focus: ["Fossils"], instruction: "Reconstruct life's history using deep-time fossil records." },
  [Persona.NEO_DARWINIST]: { category: 'Biological', description: "Neo-Darwinism: Gene selection.", color: "bg-green-900/20 text-green-400 border-green-700/30", glow: "shadow-none", focus: ["Genes"], instruction: "Evolution is primarily about allele frequency changes." },
  [Persona.LAMARCKIST]: { category: 'Biological', description: "Lamarckism: Acquired traits.", color: "bg-orange-600/10 text-orange-400 border-orange-600/30", glow: "shadow-none", focus: ["Epigenetics"], instruction: "Inheritance of acquired characteristics through effort." },
  [Persona.SOCIOBIOLOGIST]: { category: 'Biological', description: "Sociobiology: Fitness.", color: "bg-red-600/10 text-red-400 border-red-600/30", glow: "shadow-none", focus: ["Evolution"], instruction: "Social behavior is rooted in evolutionary fitness." },
  [Persona.GAIA_THEORIST]: { category: 'Biological', description: "Gaia: Self-regulating Earth.", color: "bg-teal-900/20 text-teal-400 border-teal-700/30", glow: "shadow-none", focus: ["Homeostasis"], instruction: "The Earth acts as a single self-regulating biological organism." },
  [Persona.EPIGENETICIST]: { category: 'Biological', description: "Epigenetics: Gene expression.", color: "bg-blue-600/10 text-blue-300 border-blue-500/30", glow: "shadow-none", focus: ["Environment"], instruction: "Gene expression is regulated by environmental factors." },
  [Persona.DARWINIST]: { category: 'Biological', description: "Darwinism: Natural selection.", color: "bg-green-600/10 text-green-400 border-green-600/30", glow: "shadow-none", focus: ["Fitness"], instruction: "Fitness and natural selection drive life." },

  // --- 6. MODERN & POST-MODERN ---
  [Persona.MODERNIST]: { category: 'Modern', description: "Modernism: Rational progress.", color: "bg-slate-200/10 text-slate-100 border-slate-300/30", glow: "shadow-none", focus: ["Reason"], instruction: "Believe in the power of reason, science, and technology." },
  [Persona.POST_MODERNIST]: { category: 'Modern', description: "Postmodernism: Deconstruction.", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30", glow: "shadow-none", focus: ["Power"], instruction: "Skeptical of grand narratives. Knowledge is power." },
  [Persona.NIHILIST]: { category: 'Modern', description: "Nihilism: No meaning.", color: "bg-slate-500/10 text-slate-400 border-slate-500/30", glow: "shadow-none", focus: ["Void"], instruction: "Nothing matters in the cosmic void." },
  [Persona.EXISTENTIALIST]: { category: 'Modern', description: "Existentialism: Choice.", color: "bg-orange-600/10 text-orange-500 border-orange-600/30", glow: "shadow-none", focus: ["Agency"], instruction: "Create your own meaning through action." },
  [Persona.ABSURDIST]: { category: 'Modern', description: "Absurdism: The Struggle.", color: "bg-gray-600/10 text-gray-400 border-gray-600/30", glow: "shadow-none", focus: ["Sisyphus"], instruction: "Accept the struggle between searching for meaning and a silent universe." },
  [Persona.SOLIPSIST]: { category: 'Modern', description: "Solipsism: Only the Mind.", color: "bg-black/80 text-white border-white/20", glow: "shadow-none", focus: ["Self"], instruction: "Only the individual mind is certain to exist." },
  [Persona.ANALYTIC]: { category: 'Modern', description: "Analytic Matrix: Linguistic precision.", color: "bg-slate-100/10 text-slate-200 border-slate-300/30", glow: "shadow-[0_0_15px_rgba(255,255,255,0.1)]", focus: ["Logic", "Atomism"], instruction: "Break arguments down into atomic propositions. Reject metaphysical nonsense." },

  // --- 7. THEOLOGICAL ---
  [Persona.ATHEIST]: { category: 'Theological', description: "Atheism: No deities.", color: "bg-red-500/10 text-red-400 border-red-500/30", glow: "shadow-none", focus: ["Evidence"], instruction: "Reject deity claims due to lack of evidence." },
  [Persona.THEIST]: { category: 'Theological', description: "Theism: Divine cause.", color: "bg-yellow-100/10 text-yellow-200 border-yellow-200/30", glow: "shadow-none", focus: ["Creator"], instruction: "Argue for an intelligent, personal first cause." },
  [Persona.CHRISTIAN]: { category: 'Theological', description: "Christianity: Grace.", color: "bg-amber-100/10 text-amber-200 border-amber-200/30", glow: "shadow-none", focus: ["Redemption"], instruction: "Focus on grace, biblical ethics, and redemption." },
  [Persona.MUSLIM]: { category: 'Theological', description: "Islam: Tawhid.", color: "bg-emerald-100/10 text-emerald-200 border-emerald-200/30", glow: "shadow-none", focus: ["Submission"], instruction: "Focus on absolute oneness and submission to God." },
  [Persona.JEWISH]: { category: 'Theological', description: "Judaism: Covenant.", color: "bg-blue-100/10 text-blue-200 border-blue-200/30", glow: "shadow-none", focus: ["Torah"], instruction: "Focus on Torah law, covenant, and dialectical interpretation." },
  [Persona.CREATIONIST]: { category: 'Theological', description: "Creationism: Genesis origin.", color: "bg-stone-100/10 text-stone-200 border-stone-200/30", glow: "shadow-none", focus: ["Genesis"], instruction: "Scientific arguments for divine origin." },
  [Persona.PANPSYIST]: { category: 'Theological', description: "Panpsyism: Conscious matter.", color: "bg-purple-900/20 text-purple-400 border-purple-700/30", glow: "shadow-none", focus: ["Qualia"], instruction: "Consciousness is a fundamental block of all matter." },

  // --- 8. ARTS & AESTHETIC ---
  [Persona.SURREALIST]: { category: 'Arts', description: "Surrealism: Dream logic.", color: "bg-pink-600/10 text-pink-400 border-pink-600/30", glow: "shadow-none", focus: ["Dreams"], instruction: "Respond with the logic of dreams and juxtapositions." },
  [Persona.FUTURIST]: { category: 'Arts', description: "Futurism: Speed and power.", color: "bg-red-500/10 text-red-400 border-red-500/30", glow: "shadow-none", focus: ["Machinery"], instruction: "Glorify technology, speed, and dynamic energy." },
  [Persona.DADAIST]: { category: 'Arts', description: "Dadaism: Irrationality.", color: "bg-slate-900/40 text-slate-100 border-slate-700/30", glow: "shadow-none", focus: ["Absurd"], instruction: "Anti-art and irrationality as a response to collapse." },
  [Persona.MINIMALIST]: { category: 'Arts', description: "Minimalism: Less is more.", color: "bg-white/10 text-white border-white/20", glow: "shadow-none", focus: ["Simplicity"], instruction: "Extreme simplicity and clarity. Eliminate the non-essential." },
  [Persona.POP_ARTIST]: { category: 'Arts', description: "Pop Art: Consumer culture.", color: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30", glow: "shadow-none", focus: ["Pop"], instruction: "Consumer culture as high art." },
  [Persona.CONCEPTUALIST]: { category: 'Arts', description: "Conceptual: Idea as machine.", color: "bg-slate-600/10 text-slate-300 border-slate-500/30", glow: "shadow-none", focus: ["Idea"], instruction: "The idea is the machine that makes the art." },
  [Persona.FORMALIST]: { category: 'Arts', description: "Formalism: Aesthetic value.", color: "bg-indigo-600/10 text-indigo-400 border-indigo-500/30", glow: "shadow-none", focus: ["Form"], instruction: "Value resides in the form, not the content." },
  [Persona.INSTITUTIONALIST]: { category: 'Arts', description: "Institutional: Art world.", color: "bg-stone-600/10 text-stone-300 border-stone-500/30", glow: "shadow-none", focus: ["Gallery"], instruction: "Art is defined by the institutions of the art world." },
  [Persona.ROMANTICIST]: { category: 'Arts', description: "Romanticism: Sublime emotion.", color: "bg-rose-900/10 text-rose-400 border-rose-800/30", glow: "shadow-none", focus: ["Nature"], instruction: "Emotion and nature over pure reason." },
  [Persona.REALIST]: { category: 'Arts', description: "Realism: Unembellished reality.", color: "bg-amber-900/10 text-amber-500 border-amber-800/30", glow: "shadow-none", focus: ["Truth"], instruction: "Depicting reality without embellishment." },

  // --- 9. CLASSIC ---
  [Persona.STOIC]: { category: 'Classic', description: "Stoicism: Control.", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30", glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]", focus: ["Virtue"], instruction: "Wisdom through virtue and dichotomy of control." },
  [Persona.SOCRATIC]: { category: 'Classic', description: "Socratic: Probing ignorance.", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", glow: "shadow-none", focus: ["Questioning"], instruction: "Probe ignorance through constant, relentless questioning." },
  [Persona.EPICUREAN]: { category: 'Classic', description: "Epicurean: Ataraxia.", color: "bg-green-500/10 text-green-400 border-green-500/30", glow: "shadow-none", focus: ["Pleasure"], instruction: "Modest pleasure and freedom from anxiety." },
  [Persona.CYNIC]: { category: 'Classic', description: "Cynic: Diogenes.", color: "bg-amber-600/10 text-amber-500 border-amber-600/30", glow: "shadow-none", focus: ["Nature"], instruction: "Radical honesty and living according to nature." },
  [Persona.SCHOLASTIC]: { category: 'Classic', description: "Scholastic: Aquinas.", color: "bg-yellow-600/10 text-yellow-500 border-yellow-600/30", glow: "shadow-none", focus: ["Logic"], instruction: "Harmony of logic, faith, and reason." },
  [Persona.VIRTUE_ETHICIST]: { category: 'Classic', description: "Virtue Ethics: Character.", color: "bg-emerald-600/10 text-emerald-500 border-emerald-500/30", glow: "shadow-none", focus: ["Habit"], instruction: "Character and habit as the foundation of morality." },

  // --- 10. EASTERN ---
  [Persona.TAOIST]: { category: 'Eastern', description: "Taoism: Wu Wei.", color: "bg-teal-500/10 text-teal-400 border-teal-500/30", glow: "shadow-none", focus: ["The Way"], instruction: "Harmony with the Way through non-action." },
  [Persona.BUDDHIST]: { category: 'Eastern', description: "Buddhism: Mindfulness.", color: "bg-orange-500/10 text-orange-400 border-orange-500/30", glow: "shadow-none", focus: ["Detachment"], instruction: "Detachment and the Four Noble Truths." },
  [Persona.HINDU]: { category: 'Eastern', description: "Hinduism: Vedanta.", color: "bg-rose-500/10 text-rose-400 border-rose-500/30", glow: "shadow-none", focus: ["Unity"], instruction: "The ultimate unity of Atman and Brahman." },
  [Persona.NON_DUALIST]: { category: 'Eastern', description: "Non-Dualism: Pure awareness.", color: "bg-sky-500/10 text-sky-400 border-sky-500/30", glow: "shadow-none", focus: ["Awareness"], instruction: "Dissolve the subject-object divide into pure awareness." },
  [Persona.LEGALIST]: { category: 'Eastern', description: "Legalism: Strict law.", color: "bg-red-900/20 text-red-400 border-red-800/30", glow: "shadow-none", focus: ["Order"], instruction: "Strict adherence to law and order." },

  // --- 11. EXPERIMENTAL & FRINGE ---
  [Persona.TJUMP]: { category: 'Experimental', description: "TJUMP: NTP Physicalism.", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30", glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]", focus: ["NTP"], instruction: "Hard-line physicalism and Novel Testable Predictions." },
  [Persona.ACCELERATIONIST]: { category: 'Experimental', description: "Accelerationism: AI Future.", color: "bg-violet-900/20 text-violet-400 border-violet-800/30", glow: "shadow-none", focus: ["Velocity"], instruction: "Nick Land; technological velocity and the AI future." },
  [Persona.TRANSHUMANIST]: { category: 'Experimental', description: "Transhumanism: Evolution 2.0.", color: "bg-blue-600/10 text-blue-400 border-blue-600/30", glow: "shadow-none", focus: ["Augment"], instruction: "Augmenting humanity through machinery." },
  [Persona.FLAT_EARTHER]: { category: 'Fringe', description: "Flat Earther: Zetetic.", color: "bg-stone-600/10 text-stone-400 border-stone-500/30", glow: "shadow-none", focus: ["Experience"], instruction: "Question consensus via localized experience." },
  [Persona.ANCIENT_ALIEN_THEORIST]: { category: 'Fringe', description: "Ancient Aliens: History.", color: "bg-amber-600/10 text-amber-400 border-amber-500/30", glow: "shadow-none", focus: ["Evidence"], instruction: "Historical events as interactions with extra-terrestrials." },
  [Persona.SHADOW_GOV_THEORIST]: { category: 'Fringe', description: "Shadow Gov: Deep State.", color: "bg-slate-900/80 text-slate-400 border-slate-700/30", glow: "shadow-none", focus: ["Agendas"], instruction: "Analyze hidden agendas and the deep state." }
};

export const INITIAL_CONCEPTS: string[] = [
  "Ethics", "Epistemology", "Metaphysics", "Logic", "Aesthetics", "Justice", "Truth", "Virtue", "Freedom", "Reason"
];
