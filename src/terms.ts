import {
  calculateFeeSchedulerEndingBaseFeeBps,
  type PoolConfig,
  type VirtualPool,
} from '@meteora-ag/dynamic-bonding-curve-sdk';

export type Finding = { tone: 'notice' | 'caution'; title: string; detail: string };

export type LaunchTerms = {
  address: string;
  quoteMint: string;
  feeClaimer: string;
  leftoverReceiver: string;
  tokenDecimals: number;
  tokenType: string;
  tokenAuthority: string;
  supply: string;
  quoteThreshold: string;
  quoteSymbol: string;
  startFeeBps: number;
  endFeeBps: number;
  feeMode: string;
  feePeriod: string;
  dynamicFee: boolean;
  firstSwapAtMinimum: boolean;
  creatorTradingShare: number;
  migrationFee: number;
  creatorMigrationShare: number;
  migrationFeeAmount: string;
  creatorMigrationAmount: string;
  partnerMigrationAmount: string;
  migratedPoolFee: string;
  partnerUnlockedLP: number;
  creatorUnlockedLP: number;
  partnerLockedLP: number;
  creatorLockedLP: number;
  partnerVesting: number;
  creatorVesting: number;
  curveSegments: number;
  poolCreationFee: string;
  migrationTarget: string;
  pool?: {
    address: string;
    creator: string;
    baseMint: string;
    state: string;
    quoteReserve: string;
    progress: number;
  };
  findings: Finding[];
};

const NATIVE_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDC_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

export function formatUnits(value: string | bigint, decimals: number): string {
  const raw = BigInt(value);
  const sign = raw < 0n ? '-' : '';
  const abs = raw < 0n ? -raw : raw;
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) return `${sign}${abs.toString()} base units`;
  const scale = 10n ** BigInt(decimals);
  const whole = abs / scale;
  const fraction = (abs % scale).toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${sign}${whole.toLocaleString('en-US')}${fraction ? `.${fraction}` : ''}`;
}

const asInt = (x: unknown) => Number(x ?? 0);
const asBigInt = (x: { toString(): string } | number | string) => BigInt(x.toString());

export function decodeTerms(
  config: PoolConfig,
  address: string,
  quoteDecimals: number,
  pool?: { address: string; account: VirtualPool } | null,
): LaunchTerms {
  const quoteMint = config.quoteMint.toBase58();
  const symbol = quoteMint === NATIVE_MINT ? 'SOL' : quoteMint === USDC_MAINNET || quoteMint === USDC_DEVNET ? 'USDC' : 'quote token';
  const baseFee = config.poolFees.baseFee;
  const startFeeBps = Number(baseFee.cliffFeeNumerator.toString()) / 100_000;
  const endFeeBps = baseFee.baseFeeMode === 2 ? startFeeBps : calculateFeeSchedulerEndingBaseFeeBps(
    Number(baseFee.cliffFeeNumerator.toString()),
    baseFee.firstFactor,
    Number(baseFee.secondFactor.toString()),
    Number(baseFee.thirdFactor.toString()),
    baseFee.baseFeeMode,
  );
  const migrationFee = asInt(config.migrationFeePercentage);
  const creatorMigrationShare = asInt(config.creatorMigrationFeePercentage);
  const threshold = asBigInt(config.migrationQuoteThreshold);
  const migrationFeeRaw = threshold * BigInt(migrationFee) / 100n;
  const creatorRaw = migrationFeeRaw * BigInt(creatorMigrationShare) / 100n;
  const claimableLP = asInt(config.partnerLiquidityPercentage) + asInt(config.creatorLiquidityPercentage);
  const lockedLP = asInt(config.partnerPermanentLockedLiquidityPercentage) + asInt(config.creatorPermanentLockedLiquidityPercentage);

  const findings: Finding[] = [];
  if (migrationFee > 0) findings.push({tone: 'caution', title: `${migrationFee}% graduation fee`, detail: `At the threshold, ${formatUnits(migrationFeeRaw, quoteDecimals)} ${symbol} is allocated as migration fee before liquidity is formed. The creator receives ${creatorMigrationShare}% of that fee.`});
  if (claimableLP > 0) findings.push({tone: 'caution', title: `${claimableLP}% non-permanent LP allocation`, detail: 'The partner/creator split is visible on-chain. Check vesting terms below before treating these positions as immediately withdrawable.'});
  if (config.tokenUpdateAuthority !== 1) findings.push({tone: 'caution', title: 'Token metadata authority is retained', detail: `Authority mode ${config.tokenUpdateAuthority} is configured. Immutable metadata uses mode 1; check who controls the configured authority.`});
  if (config.enableFirstSwapWithMinFee === 1) findings.push({tone: 'caution', title: 'First swap uses minimum fee', detail: 'The first buyer may pay a lower base fee than the scheduled opening rate.'});
  if (config.poolFees.dynamicFee.initialized !== 0) findings.push({tone: 'notice', title: 'Dynamic fee enabled', detail: 'The live trading fee can rise above the scheduled base fee when price volatility triggers it.'});
  if (lockedLP < 10 && asInt(config.partnerLiquidityVestingInfo.vestingPercentage) + asInt(config.creatorLiquidityVestingInfo.vestingPercentage) === 0) findings.push({tone: 'caution', title: 'Review lock terms', detail: 'No explicit first-day lock is visible in these four LP allocations; check version-specific vesting and migration rules.'});

  const stateNames = ['Trading on DBC', 'Curve complete', 'Ready for DAMM', 'DAMM pool created'];
  const state = pool?.account.poolState;
  const progress = state && threshold > 0n
    ? Math.min(100, Number(asBigInt(state.quoteReserve) * 10_000n / threshold) / 100)
    : 0;

  return {
    address,
    quoteMint,
    feeClaimer: config.feeClaimer.toBase58(),
    leftoverReceiver: config.leftoverReceiver.toBase58(),
    tokenDecimals: config.tokenDecimal,
    tokenType: config.tokenType === 0 ? 'SPL Token' : 'Token-2022',
    tokenAuthority: ['Creator may edit metadata', 'Immutable metadata', 'Partner may edit metadata', 'Creator may edit metadata and mint', 'Partner may edit metadata and mint'][config.tokenUpdateAuthority] ?? `Mode ${config.tokenUpdateAuthority}`,
    supply: formatUnits(config.preMigrationTokenSupply.toString(), config.tokenDecimal),
    quoteThreshold: formatUnits(threshold, quoteDecimals),
    quoteSymbol: symbol,
    startFeeBps,
    endFeeBps: Number(endFeeBps.toFixed(2)),
    feeMode: baseFee.baseFeeMode === 0 ? 'Linear' : baseFee.baseFeeMode === 1 ? 'Exponential' : 'Legacy rate limiter',
    feePeriod: baseFee.baseFeeMode === 2 ? 'Legacy rate limiter; fee varies by trade size' : baseFee.firstFactor === 0 ? 'Fixed' : `${baseFee.firstFactor} steps over ${Number(baseFee.secondFactor.toString()) * baseFee.firstFactor} ${config.activationType === 1 ? 'seconds' : 'slots'}`,
    dynamicFee: config.poolFees.dynamicFee.initialized !== 0,
    firstSwapAtMinimum: config.enableFirstSwapWithMinFee === 1,
    creatorTradingShare: config.creatorTradingFeePercentage,
    migrationFee,
    creatorMigrationShare,
    migrationFeeAmount: formatUnits(migrationFeeRaw, quoteDecimals),
    creatorMigrationAmount: formatUnits(creatorRaw, quoteDecimals),
    partnerMigrationAmount: formatUnits(migrationFeeRaw - creatorRaw, quoteDecimals),
    migratedPoolFee: config.migrationFeeOption === 6 ? `${config.migratedPoolFeeBps / 100}%` : ['0.25%', '0.3%', '1%', '2%', '4%', '6%'][config.migrationFeeOption] ?? 'Unknown',
    partnerUnlockedLP: config.partnerLiquidityPercentage,
    creatorUnlockedLP: config.creatorLiquidityPercentage,
    partnerLockedLP: config.partnerPermanentLockedLiquidityPercentage,
    creatorLockedLP: config.creatorPermanentLockedLiquidityPercentage,
    partnerVesting: config.partnerLiquidityVestingInfo.vestingPercentage,
    creatorVesting: config.creatorLiquidityVestingInfo.vestingPercentage,
    curveSegments: config.curve.filter(point => !point.liquidity.isZero()).length,
    poolCreationFee: formatUnits(config.poolCreationFee.toString(), 9),
    migrationTarget: config.migrationOption === 1 ? 'Meteora DAMM v2' : 'Legacy DAMM v1',
    pool: pool && state ? {
      address: pool.address,
      creator: state.creator.toBase58(),
      baseMint: state.baseMint.toBase58(),
      state: stateNames[state.migrationProgress] ?? `State ${state.migrationProgress}`,
      quoteReserve: formatUnits(state.quoteReserve.toString(), quoteDecimals),
      progress,
    } : undefined,
    findings,
  };
}
