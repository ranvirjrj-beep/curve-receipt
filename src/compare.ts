import { NATIVE_MINT } from '@solana/spl-token';
import { buildConfig, type Design } from './studio';
import { formatUnits, type LaunchTerms } from './terms';

export type Comparison = { name: string; planned: string; onchain: string; matches: boolean };

/** Compare selected economic terms, not the entire curve or who authored it. */
export function comparePlan(design: Design, terms: LaunchTerms): Comparison[] {
  const built = buildConfig(design);
  if (!built.tokenSupply) throw new Error('Expected a fixed-supply DBC config.');
  const plannedFeePeriod = design.feeDurationSeconds === 0 ? 'Fixed' : `10 steps over ${design.feeDurationSeconds} seconds`;
  const feeShare = (fee: number, share: number) => fee === 0 ? 'Not applicable (no graduation fee)' : `${share}% of graduation fee`;
  const items: [string, string, string][] = [
    ['Quote asset', 'SOL', terms.quoteMint === NATIVE_MINT.toBase58() ? 'SOL' : terms.quoteMint],
    ['Graduation threshold', `${formatUnits(built.migrationQuoteThreshold.toString(), 9)} SOL`, `${terms.quoteThreshold} ${terms.quoteSymbol}`],
    ['Pre-migration token supply', formatUnits(built.tokenSupply.preMigrationTokenSupply.toString(), 6), terms.supply],
    ['Token type', 'SPL Token', terms.tokenType],
    ['Token decimals', '6', `${terms.tokenDecimals}`],
    ['Opening fee', `${design.startFeeBps} bps`, `${terms.startFeeBps} bps`],
    ['Ending fee', `${design.endFeeBps} bps`, `${terms.endFeeBps} bps`],
    ['Fee schedule mode', 'Linear', terms.feeMode],
    ['Fee reduction schedule', plannedFeePeriod, terms.feePeriod],
    ['First swap at minimum fee', 'No', terms.firstSwapAtMinimum ? 'Yes' : 'No'],
    ['Dynamic fee', 'Off', terms.dynamicFee ? 'Enabled' : 'Off'],
    ['Creator trading fee share', '100%', `${terms.creatorTradingShare}%`],
    ['Pool creation fee', '0 SOL', `${terms.poolCreationFee} SOL`],
    ['Total graduation fee', `${design.migrationFeePercent}%`, `${terms.migrationFee}%`],
    ['Creator graduation fee share', feeShare(design.migrationFeePercent, 100), feeShare(terms.migrationFee, terms.creatorMigrationShare)],
    ['Creator LP outside permanent lock', `${design.creatorUnlockedLP}%`, `${terms.creatorUnlockedLP}%`],
    ['Creator permanently locked LP', `${100 - design.creatorUnlockedLP}%`, `${terms.creatorLockedLP}%`],
    ['Partner LP outside permanent lock', '0%', `${terms.partnerUnlockedLP}%`],
    ['Partner permanently locked LP', '0%', `${terms.partnerLockedLP}%`],
    ['Creator non-permanent LP vesting', '0%', `${terms.creatorVesting}%`],
    ['Partner non-permanent LP vesting', '0%', `${terms.partnerVesting}%`],
    ['Token authority', 'Immutable metadata', terms.tokenAuthority],
    ['Migration target', 'Meteora DAMM v2', terms.migrationTarget],
    ['DAMM trading fee', '0.25%', terms.migratedPoolFee],
  ];
  return items.map(([name, planned, onchain]) => ({ name, planned, onchain, matches: planned === onchain }));
}
