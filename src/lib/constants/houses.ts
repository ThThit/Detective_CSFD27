export const HOUSE_META = {
  tracer: {
    name: "Tracer",
    tagline: "Evidence Tracker",
    color: "#121358",
    rgb: [18, 19, 88] as const,
    desc: `Extraordinary sense of smell, capable of uncovering even the faintest traces left behind. We have sharp instincts and follow every clue with unwavering determination.
    \nKnown for our patience and sharp instincts, we follow every clue with unwavering determination to collect everything that is needed.`,
    heroBg: "#0d0e2e",
  },
  noir: {
    name: "Noir",
    tagline: "Shadow Spy",
    color: "#274C27",
    rgb: [39, 76, 39] as const,
    desc: `We are quiet, observant, and sharp-eyed who work quietly in the shadows, solving mysteries by noticing small clues that others miss.
\nWe work quietly in the shadows, solving mysteries by noticing small clues that others miss. We use curiosity and clever thinking to uncover hidden stories. Quiet, agile, and sharp-eyed. We represent the silent, observant, and always ready to follow the next clue.`,
    heroBg: "#162416",
  },
  foxlock: {
    name: "Foxlock",
    tagline: "Sly Messenger",
    color: "#4C1A17",
    rgb: [76, 26, 23] as const,
    desc: `We communicate secrets, decode messages, and play smart with words. We use charm and cleverness to move the case forward.
\nBuilt on sharp instincts and clever communication, we solve mysteries by reading between the lines and decoding what others overlook. Adaptable and always alert, we know how to turn small details into smart moves. Like a fox, we stay calm, wise, and one step ahead.`,
    heroBg: "#2a0f0d",
  },
  cipher: {
    name: "Cipher",
    tagline: "Clue Analyst",
    color: "#402561",
    rgb: [64, 37, 97] as const,
    desc: `The mind behind the investigations. Our exceptional analytical skills and a talent for recognizing hidden patterns.
\nWhile others gather evidence, we pieces it together, transforming scattered details into clear answers. We believe that every mystery leaves a trail of logic waiting to be discovered.`,
    heroBg: "#261540",
  },
} as const;

export const HOUSES = ["noir", "foxlock", "tracer", "cipher"] as const;
export type House = (typeof HOUSES)[number];
