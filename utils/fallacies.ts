export interface FallacyDefinition {
  name: string;
  description: string;
  example: string;
}

export const LOGICAL_FALLACIES: FallacyDefinition[] = [
  {
    name: "Ad Hominem",
    description: "Attacking the person making the argument rather than addressing the argument itself.",
    example: "You can't trust John's opinion on climate change because he's not a scientist."
  },
  {
    name: "Abusive Ad Hominem",
    description: "Directly insulting or attacking the character of the person making the argument.",
    example: "You're an idiot, so your argument is wrong."
  },
  {
    name: "Circumstantial Ad Hominem",
    description: "Dismissing an argument because of the person's circumstances or interests.",
    example: "Of course the doctor recommends surgery; surgeons make money from operations."
  },
  {
    name: "Tu Quoque",
    description: "Dismissing someone's argument because they don't follow their own advice.",
    example: "You can't tell me to quit smoking when you smoke yourself."
  },
  {
    name: "Appeal to Authority",
    description: "Using an authority figure's opinion as evidence for a claim, even when the authority is not relevant to the topic.",
    example: "Einstein believed in God, so God must exist."
  },
  {
    name: "Appeal to False Authority",
    description: "Using an authority figure who is not actually an expert in the relevant field.",
    example: "My favorite actor says this diet works, so it must be scientifically proven."
  },
  {
    name: "Appeal to Anonymous Authority",
    description: "Using vague or unnamed authorities as evidence.",
    example: "Experts say that eating chocolate helps you lose weight."
  },
  {
    name: "Appeal to Tradition",
    description: "Arguing that something is right or good simply because it's been done that way for a long time.",
    example: "We've always used this method, so there's no reason to change it."
  },
  {
    name: "Appeal to Novelty",
    description: "Claiming something is better simply because it's new or modern.",
    example: "This new technology must be superior because it's the latest innovation."
  },
  {
    name: "Appeal to Popularity",
    description: "Arguing that something must be true or good because many people believe or do it.",
    example: "Millions of people believe in astrology, so it must be true."
  },
  {
    name: "Appeal to the Majority",
    description: "Assuming that if most people believe something, it must be correct.",
    example: "90% of people think this policy is good, so it must be right."
  },
  {
    name: "Bandwagon Fallacy",
    description: "Assuming something is true or good because many others are doing it or believe it.",
    example: "Everyone is buying this product, so you should too."
  },
  {
    name: "Appeal to Emotion",
    description: "Using emotional manipulation instead of logical reasoning to support an argument.",
    example: "Think of the children! We must pass this law."
  },
  {
    name: "Appeal to Fear",
    description: "Using fear to persuade rather than providing evidence.",
    example: "If we don't act now, terrible things will happen!"
  },
  {
    name: "Appeal to Pity",
    description: "Attempting to evoke pity to support an argument.",
    example: "I should get a good grade because I studied so hard and was really stressed."
  },
  {
    name: "Appeal to Flattery",
    description: "Using compliments to get someone to accept your argument.",
    example: "Someone as intelligent as you can surely see the merit of this proposal."
  },
  {
    name: "Appeal to Ridicule",
    description: "Mocking or making fun of an argument instead of addressing it seriously.",
    example: "That's a ridiculous idea! Ha! Next you'll say the earth is flat."
  },
  {
    name: "Appeal to Spite",
    description: "Arguing for something out of spite or malice rather than logical reasons.",
    example: "I'm voting against this just to spite my opponent."
  },
  {
    name: "Appeal to Consequences",
    description: "Arguing that a belief is true or false based on its consequences.",
    example: "Belief in free will must be true because the alternative is too depressing."
  },
  {
    name: "Appeal to Nature",
    description: "Arguing that something is good because it's natural, or bad because it's unnatural.",
    example: "This medicine is natural, so it must be safer than synthetic drugs."
  },
  {
    name: "Appeal to Ignorance",
    description: "Claiming something is true because it hasn't been proven false, or vice versa.",
    example: "No one has proven that ghosts don't exist, so they must be real."
  },
  {
    name: "Appeal to Incredulity",
    description: "Arguing that something must be false because you can't understand or believe it.",
    example: "I can't imagine how evolution could create such complexity, so it must be wrong."
  },
  {
    name: "Appeal to Probability",
    description: "Assuming that something will happen because it could happen.",
    example: "There's a small chance this plane will crash, so it probably will."
  },
  {
    name: "Appeal to Common Sense",
    description: "Dismissing evidence or arguments that contradict common beliefs.",
    example: "Common sense tells us that heavier objects fall faster, despite what physics says."
  },
  {
    name: "Appeal to Intuition",
    description: "Using gut feelings or intuitions as evidence for a claim.",
    example: "I just know this is true; it feels right to me."
  },
  {
    name: "Appeal to Personal Experience",
    description: "Using one's own limited experience as universal proof.",
    example: "I've never seen a car accident, so seat belts aren't necessary."
  },
  {
    name: "Appeal to Belief",
    description: "Arguing that something is true because many people believe it.",
    example: "Most people believe in God, so God must exist."
  },
  {
    name: "Appeal to Faith",
    description: "Using faith or religious belief as evidence for a factual claim.",
    example: "I have faith that this medicine works, so it must be effective."
  },
  {
    name: "Appeal to Motive",
    description: "Dismissing an argument because of the supposed motives of the person making it.",
    example: "You only support this policy because you'll benefit from it."
  },
  {
    name: "Appeal to Hypocrisy",
    description: "Dismissing an argument because the person making it doesn't follow it themselves.",
    example: "You can't criticize my diet when you eat fast food sometimes."
  },
  {
    name: "Appeal to Force",
    description: "Using threats or coercion instead of reasoning to support an argument.",
    example: "Agree with me or I'll fire you."
  },
  {
    name: "Appeal to Threat",
    description: "Intimidating someone into accepting an argument.",
    example: "If you don't support this, you're not a real patriot."
  },
  {
    name: "Appeal to Loyalty",
    description: "Using loyalty to a group or cause as a reason to accept an argument.",
    example: "As a loyal party member, you should vote for this candidate."
  },
  {
    name: "Appeal to Patriotism",
    description: "Using national pride to support an argument.",
    example: "True Americans support this policy."
  },
  {
    name: "Appeal to Antiquity",
    description: "Arguing that something is better because it's old or ancient.",
    example: "Traditional medicine is better because it's been used for thousands of years."
  },
  {
    name: "Anecdotal Fallacy",
    description: "Using a personal experience or isolated example instead of sound reasoning or evidence.",
    example: "I know someone who smoked their whole life and lived to 100, so smoking isn't dangerous."
  },
  {
    name: "Availability Heuristic",
    description: "Overestimating the probability of events that are easily remembered or imagined.",
    example: "I think plane crashes are common because I just saw one on the news."
  },
  {
    name: "Base Rate Fallacy",
    description: "Ignoring statistical base rates in favor of specific information.",
    example: "This test is 95% accurate, so if you test positive, you probably have the disease (ignoring that the disease is very rare)."
  },
  {
    name: "Begging the Question",
    description: "Assuming the conclusion of an argument in the premises.",
    example: "God exists because the Bible says so, and the Bible is the word of God."
  },
  {
    name: "Biased Sample",
    description: "Drawing a conclusion from a sample that is not representative of the population.",
    example: "I surveyed 10 people at a coffee shop, and all love coffee, so everyone must love coffee."
  },
  {
    name: "Cherry Picking",
    description: "Selecting only evidence that supports your position while ignoring contradicting evidence.",
    example: "Studies show this diet works (ignoring the 20 studies that show it doesn't)."
  },
  {
    name: "Circular Reasoning",
    description: "Using the conclusion as a premise or assuming what you're trying to prove.",
    example: "The Bible is true because it says it's the word of God, and God wouldn't lie."
  },
  {
    name: "Complex Question",
    description: "Asking a question that assumes an unproven premise.",
    example: "Have you stopped beating your wife? (assumes the person was beating their wife)"
  },
  {
    name: "Composition Fallacy",
    description: "Assuming that what is true of the parts is true of the whole.",
    example: "Each part of this car is lightweight, so the whole car must be lightweight."
  },
  {
    name: "Division Fallacy",
    description: "Assuming that what is true of the whole is true of the parts.",
    example: "This university is excellent, so every professor must be excellent."
  },
  {
    name: "Confirmation Bias",
    description: "Favoring information that confirms existing beliefs while ignoring contradictory evidence.",
    example: "Only reading news sources that align with your political views."
  },
  {
    name: "Continuum Fallacy",
    description: "Rejecting a claim because it's not possible to draw a precise line between two cases.",
    example: "Since we can't say exactly when a person becomes 'tall', the concept of tallness is meaningless."
  },
  {
    name: "Correlation Equals Causation",
    description: "Assuming that because two things are correlated, one must cause the other.",
    example: "Ice cream sales and drowning incidents both increase in summer, so ice cream causes drowning."
  },
  {
    name: "Causal Oversimplification",
    description: "Oversimplifying complex causes by focusing on a single factor.",
    example: "Poverty causes crime (ignoring many other factors)."
  },
  {
    name: "Causal Reductionism",
    description: "Reducing complex phenomena to a single cause.",
    example: "All human behavior is caused by genes."
  },
  {
    name: "False Cause",
    description: "Assuming a causal relationship between two events without sufficient evidence.",
    example: "I wore my lucky shirt and won the game, so the shirt caused me to win."
  },
  {
    name: "Post Hoc Ergo Propter Hoc",
    description: "Assuming that because one event followed another, the first caused the second.",
    example: "I prayed for rain, and it rained, so my prayer caused the rain."
  },
  {
    name: "Cum Hoc Ergo Propter Hoc",
    description: "Assuming that because two events happened at the same time, one caused the other.",
    example: "My car broke down right after I filled the gas tank, so the gas must have caused it."
  },
  {
    name: "False Analogy",
    description: "Using an analogy where the compared items are not sufficiently similar.",
    example: "Employees are like nails; you need to hit them on the head to get them to work."
  },
  {
    name: "False Attribution",
    description: "Incorrectly attributing a quote, idea, or fact to a source.",
    example: "Einstein said 'Imagination is more important than knowledge' in the context of education (he actually said it about scientific discovery)."
  },
  {
    name: "False Balance",
    description: "Presenting two sides of an argument as equally valid when one has more evidence.",
    example: "Some scientists say climate change is real, others say it's not, so the jury is still out."
  },
  {
    name: "False Consensus Effect",
    description: "Overestimating the extent to which others share one's beliefs or opinions.",
    example: "Everyone I know agrees with me, so most people must think the same way."
  },
  {
    name: "False Dichotomy",
    description: "Presenting only two options when more exist.",
    example: "You're either with us or against us."
  },
  {
    name: "False Dilemma",
    description: "Limiting options to only two choices when more possibilities exist.",
    example: "Either we cut taxes or the economy will collapse."
  },
  {
    name: "False Equivalence",
    description: "Treating two things as equal when they're not.",
    example: "Both political parties are equally corrupt."
  },
  {
    name: "False Precision",
    description: "Using numbers or statistics with more precision than the data supports.",
    example: "This policy will create exactly 47,392 new jobs."
  },
  {
    name: "False Premise",
    description: "Basing an argument on a premise that is incorrect.",
    example: "All birds can fly. Penguins are birds. Therefore, penguins can fly."
  },
  {
    name: "False Representation",
    description: "Misrepresenting someone's argument or position.",
    example: "You said we should consider all options, so you're saying we should do nothing."
  },
  {
    name: "Fallacy Fallacy",
    description: "Assuming that because an argument contains a fallacy, its conclusion must be false.",
    example: "Your argument has a logical flaw, so you must be wrong about everything."
  },
  {
    name: "Faulty Generalization",
    description: "Drawing a conclusion from insufficient evidence.",
    example: "I met two unfriendly people from that city, so everyone there must be rude."
  },
  {
    name: "Hasty Generalization",
    description: "Making a broad conclusion based on a small or unrepresentative sample.",
    example: "My last three relationships failed, so all relationships are doomed."
  },
  {
    name: "Sweeping Generalization",
    description: "Applying a general rule to a specific case where it doesn't apply.",
    example: "Exercise is good for you, so you should exercise even when you have the flu."
  },
  {
    name: "Overgeneralization",
    description: "Drawing a conclusion that is too broad based on limited evidence.",
    example: "One bad experience with a lawyer means all lawyers are dishonest."
  },
  {
    name: "Genetic Fallacy",
    description: "Dismissing an argument based on its origin rather than its merits.",
    example: "You can't trust this idea because it came from a political opponent."
  },
  {
    name: "Guilt by Association",
    description: "Rejecting an argument or idea because of the people who support it.",
    example: "Hitler was a vegetarian, so vegetarianism must be wrong."
  },
  {
    name: "Halo Effect",
    description: "Assuming that because someone is good at one thing, they're good at everything.",
    example: "She's a great actor, so she must be an expert on politics."
  },
  {
    name: "Horn Effect",
    description: "Assuming that because someone has one negative trait, they have many negative traits.",
    example: "He's not good at math, so he must be unintelligent overall."
  },
  {
    name: "Historian's Fallacy",
    description: "Judging past decisions by information that wasn't available at the time.",
    example: "They should have known the stock market would crash in 1929."
  },
  {
    name: "Hot Hand Fallacy",
    description: "Believing that success in a random event makes future success more likely.",
    example: "I've won three times in a row, so I'm on a streak and will win again."
  },
  {
    name: "Illusory Correlation",
    description: "Perceiving a relationship between variables when none exists.",
    example: "I always wear my lucky socks when my team wins, so the socks cause the wins."
  },
  {
    name: "Incomplete Comparison",
    description: "Making a comparison without specifying what is being compared.",
    example: "This product is better (better than what?)."
  },
  {
    name: "Inconsistent Comparison",
    description: "Comparing different things as if they were the same.",
    example: "This car is more expensive, so it must be better (but you're comparing different car models)."
  },
  {
    name: "Loaded Question",
    description: "Asking a question that contains an unjustified assumption.",
    example: "Why do you always lie? (assumes the person lies frequently)"
  },
  {
    name: "Masked Man Fallacy",
    description: "Substituting one thing for another in an argument.",
    example: "I know who my father is. I don't know who the masked man is. Therefore, my father is not the masked man."
  },
  {
    name: "Middle Ground Fallacy",
    description: "Assuming that a compromise between two positions must be correct.",
    example: "One person says 2+2=4, another says 2+2=6, so the answer must be 5."
  },
  {
    name: "Moralistic Fallacy",
    description: "Assuming that what is morally good must be naturally good, or vice versa.",
    example: "Natural selection is cruel, so it can't be how evolution works."
  },
  {
    name: "Naturalistic Fallacy",
    description: "Deriving an 'ought' from an 'is' - inferring what should be from what is.",
    example: "Nature is competitive, so humans should be competitive."
  },
  {
    name: "Nirvana Fallacy",
    description: "Comparing a realistic option to an idealized, perfect option.",
    example: "This policy won't solve all problems, so we shouldn't implement it."
  },
  {
    name: "No True Scotsman",
    description: "Changing the definition of a term to exclude counterexamples.",
    example: "No true Christian would do that. When shown a Christian who did, 'Well, they're not a TRUE Christian.'"
  },
  {
    name: "Non Sequitur",
    description: "A conclusion that doesn't logically follow from the premises.",
    example: "It's sunny today, so you should vote for me."
  },
  {
    name: "Package Deal Fallacy",
    description: "Treating things that may be independent as if they must be accepted or rejected together.",
    example: "If you don't accept this entire ideology, you can't accept any part of it."
  },
  {
    name: "Perfectionist Fallacy",
    description: "Rejecting something because it's not perfect.",
    example: "This solution has flaws, so we shouldn't use it at all."
  },
  {
    name: "Personal Incredulity",
    description: "Arguing that something must be false because you can't understand how it works.",
    example: "I can't understand quantum physics, so it must be nonsense."
  },
  {
    name: "Poisoning the Well",
    description: "Providing negative information about someone before they speak to discredit them.",
    example: "Before you listen to her, you should know she's been accused of fraud."
  },
  {
    name: "Prosecutor's Fallacy",
    description: "Confusing the probability of evidence given guilt with the probability of guilt given evidence.",
    example: "The DNA matches, so there's a 99% chance the defendant is guilty (when the match rate is actually 1 in a million)."
  },
  {
    name: "Red Herring",
    description: "Introducing an irrelevant topic to distract from the main issue.",
    example: "We should focus on the real problem: what about crime rates?"
  },
  {
    name: "Regression Fallacy",
    description: "Failing to account for natural fluctuations in data.",
    example: "After a record-breaking year, performance declined, so we must have done something wrong."
  },
  {
    name: "Regression to the Mean Fallacy",
    description: "Failing to understand that extreme events are often followed by less extreme events.",
    example: "After an unusually hot summer, it cooled down, so the climate change theory must be wrong."
  },
  {
    name: "Reification",
    description: "Treating an abstract concept as if it were a concrete thing.",
    example: "Society demands this (as if 'society' is a conscious entity that can demand things)."
  },
  {
    name: "Relative Privation",
    description: "Dismissing an argument by claiming something else is more important.",
    example: "Why worry about pollution when people are starving?"
  },
  {
    name: "Retroactive Causation",
    description: "Assuming that a later event caused an earlier event.",
    example: "The stock market crashed because I bought stock yesterday."
  },
  {
    name: "Self-Sealing Argument",
    description: "An argument that cannot be disproven because any counterevidence is reinterpreted as support.",
    example: "I believe in this conspiracy theory, and any evidence against it is just part of the cover-up."
  },
  {
    name: "Shifting the Burden of Proof",
    description: "Requiring someone else to disprove your claim rather than proving it yourself.",
    example: "Prove that ghosts don't exist!"
  },
  {
    name: "Slippery Slope",
    description: "Arguing that one action will lead to a chain of negative consequences without sufficient evidence.",
    example: "If we allow same-sex marriage, next people will want to marry animals."
  },
  {
    name: "Special Pleading",
    description: "Applying standards or rules differently to different situations without justification.",
    example: "You should forgive me for lying, but you shouldn't lie to me."
  },
  {
    name: "Spotlight Fallacy",
    description: "Overestimating the frequency of events that receive media attention.",
    example: "Plane crashes seem common because they're always in the news."
  },
  {
    name: "Straw Man",
    description: "Misrepresenting someone's argument to make it easier to attack.",
    example: "You want to raise taxes? So you want to destroy the economy!"
  },
  {
    name: "Suppressed Evidence",
    description: "Ignoring evidence that contradicts one's argument.",
    example: "This medicine works (ignoring studies showing dangerous side effects)."
  },
  {
    name: "Texas Sharpshooter Fallacy",
    description: "Selecting a pattern after the fact rather than testing a hypothesis.",
    example: "Look at all these coincidences that prove my theory! (after cherry-picking data)."
  },
  {
    name: "Third Variable Fallacy",
    description: "Failing to consider that a third variable might explain a correlation.",
    example: "People who exercise more have better health (ignoring that healthy people are more likely to exercise)."
  },
  {
    name: "Undistributed Middle",
    description: "A syllogistic fallacy where the middle term is not distributed in either premise.",
    example: "All birds have wings. All planes have wings. Therefore, all planes are birds."
  },
  {
    name: "Unfalsifiable Claim",
    description: "Making a claim that cannot be proven false, making it unscientific.",
    example: "The universe was created last Thursday with all our memories intact (impossible to disprove)."
  },
  {
    name: "Weak Analogy",
    description: "Using an analogy that is not sufficiently similar to the situation being discussed.",
    example: "Running a country is like running a business, so we should treat it like one."
  },
  {
    name: "Wishful Thinking",
    description: "Believing something is true because you want it to be true.",
    example: "I know I'll win the lottery this time because I really need the money."
  },
  {
    name: "Zero-Sum Fallacy",
    description: "Assuming that one person's gain must be another's loss, when both could benefit.",
    example: "If immigrants get jobs, native citizens will lose jobs (ignoring job creation)."
  }
];
