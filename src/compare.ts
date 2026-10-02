import { NATIVE_MINT } from '@solana/spl-token';
import { buildConfig, type Design } from './studio';
import { formatUnits, type LaunchTerms } from './terms';

export type Comparison = { name: string; planned: string; onchain: string; matches: boolean };

/** A local draft is editable; this comparison does not attest who authored it. */
export function comparePlan(design: Design, terms: LaunchTerms): Comparison[] {
  const built = buildConfig(design);
  if (!built.tokenSupply) throw new Error('Expected a fixed-supply DBC config.');
  const items: [string, string, string][] = [
    ['Quote asset', 'SOL', terms.quoteMint === NATIVE_MINT.toBase58() ? 'SOL' : terms.quoteMint],
    ['Graduation threshold', `${formatUnits(built.migrationQuoteThreshold.toString(), 9)} SOL`, `${terms.quoteThreshold} ${terms.quoteSymbol}`],
    ['Pre-migration token supply', formatUnits(built.tokenSupply.preMigrationTokenSupply.toString(), 6), terms.supply],
    ['Opening fee', `${design.startFeeBps} bps`, `${terms.startFeeBps} bps`],
    ['Ending fee', `${design.endFeeBps} bps`, `${terms.endFeeBps} bps`],
    ['Creator graduation take', `${design.migrationFeePercent}%`, `${terms.migrationFee}%`],
    ['Creator LP outside permanent lock', `${design.creatorUnlockedLP}%`, `${terms.creatorUnlockedLP}%`],
    ['Creator permanently locked LP', `${100 - design.creatorUnlockedLP}%`, `${terms.creatorLockedLP}%`],
    ['Token authority', 'Immutable metadata', terms.tokenAuthority],
    ['Migration target', 'Meteora DAMM v2', terms.migrationTarget],
  ];
  return items.map(([name, planned, onchain]) => ({ name, planned, onchain, matches: planned === onchain }));
}
