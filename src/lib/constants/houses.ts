export const HOUSE_META = {
  tracer: {
    name: 'Tracer',
    tagline: 'Evidence Tracker',
    color: '#121358',
    rgb: [18, 19, 88] as const,
    desc: 'Tracer - Evidence Tracker leave no clue unexamined...',
    heroBg: '#0d0e2e',
  },
  noir: {
    name: 'Noir',
    tagline: 'Shadow Spy',
    color: '#274C27',
    rgb: [39, 76, 39] as const,
    desc: 'Noir - Shadow Spy connects what others overlook...',
    heroBg: '#162416',
  },
  foxlock: {
    name: 'Foxlock',
    tagline: 'Sly Messenger',
    color: '#4C1A17',
    rgb: [76, 26, 23] as const,
    desc: 'Foxlock - Sly Messenger thrive where logic meets mystery...',
    heroBg: '#2a0f0d',
  },
  cipher: {
    name: 'Cipher',
    tagline: 'Clue Analyst',
    color: '#402561',
    rgb: [64, 37, 97] as const,
    desc: 'Cipher - Clue Analyst move through the margins...',
    heroBg: '#261540',
  },
} as const;

export const HOUSES = ['noir', 'foxlock', 'tracer', 'cipher'] as const;
export type House = (typeof HOUSES)[number];
