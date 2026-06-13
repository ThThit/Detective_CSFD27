export const HOUSES = ['noir', 'foxlock', 'tracer', 'cipher'] as const;
export type House = (typeof HOUSES)[number];
