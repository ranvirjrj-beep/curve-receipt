import test from 'node:test';
import assert from 'node:assert/strict';
import BN from 'bn.js';
import { Keypair } from '@solana/web3.js';
import { NATIVE_MINT, } from '@solana/spl-token';
import type { PoolConfig, VirtualPool } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { DEFAULT_DESIGN, buildConfig, validateDesign } from '../src/studio';
import { decodeTerms } from '../src/terms';
import { comparePlan } from '../src/compare';

test('SDK constructs a fixed-supply DAMM v2 launch without a migration take', () => {
  const config = buildConfig(DEFAULT_DESIGN);
  assert.equal(config.migrationOption, 1);
  assert.equal(config.migrationQuoteThreshold.toString(), '2000000000');
  assert.equal(config.tokenSupply.preMigrationTokenSupply.toString(), '100000000000000');
  assert.equal(config.creatorPermanentLockedLiquidityPercentage, 100);
  assert.equal(config.creatorLiquidityPercentage, 0);
  assert.equal(config.migrationFee.feePercentage, 0);
  assert.equal(config.curve.filter(point => !point.liquidity.isZero()).length, 2);
});

test('disclosure calculations agree with on-chain integer units and remain separate from LP rights', () => {
  const chosen = { ...DEFAULT_DESIGN, threshold: 20, migrationFeePercent: 15, creatorUnlockedLP: 25 };
  const fromSdk = buildConfig(chosen);
  const wallet = Keypair.generate().publicKey;
  const config = {
    ...fromSdk,
    quoteMint: NATIVE_MINT,
    feeClaimer: wallet,
    leftoverReceiver: wallet,
    poolFees: { ...fromSdk.poolFees, dynamicFee: { initialized: 0 } },
    preMigrationTokenSupply: fromSdk.tokenSupply.preMigrationTokenSupply,
    migrationFeePercentage: 15,
    creatorMigrationFeePercentage: 100,
    fixedTokenSupplyFlag: 1,
    migratedPoolFeeBps: 25,
    migratedPoolBaseFeeMode: 0,
    migratedCollectFeeMode: 0,
    enableFirstSwapWithMinFee: 0,
    curve: fromSdk.curve,
  } as unknown as PoolConfig;
  const pool = {
    poolState: {
      quoteReserve: new BN('10000000000'),
      creator: wallet,
      baseMint: Keypair.generate().publicKey,
      migrationProgress: 0,
    },
  } as VirtualPool;
  const terms = decodeTerms(config, wallet.toBase58(), 9, { address: wallet.toBase58(), account: pool });
  assert.equal(terms.migrationFeeAmount, '3');
  assert.equal(terms.creatorMigrationAmount, '3');
  assert.equal(terms.partnerMigrationAmount, '0');
  assert.equal(terms.creatorUnlockedLP, 25);
  assert.equal(terms.creatorLockedLP, 75);
  assert.equal(terms.pool?.progress, 50);
  assert.equal(terms.startFeeBps, 100);
  // Rounding a fee before comparison can falsely match a different on-chain rate.
  const preciseConfig = { ...config, poolFees: { ...config.poolFees, baseFee: {
    ...config.poolFees.baseFee, cliffFeeNumerator: new BN('10000001'),
  } } } as PoolConfig;
  const preciseTerms = decodeTerms(preciseConfig, wallet.toBase58(), 9);
  assert.ok(Math.abs(preciseTerms.endFeeBps - 100.00001) < 1e-10);
  assert.equal(comparePlan(chosen, preciseTerms).find(row => row.name === 'Ending fee')?.matches, false);
  assert.ok(terms.findings.some(f => f.title.includes('15% graduation fee')));
  const reviewed = comparePlan(chosen, terms);
  assert.equal(reviewed.length, 24);
  assert.ok(reviewed.every(row => row.matches), JSON.stringify(reviewed.filter(row => !row.matches)));
  const changed = comparePlan(chosen, { ...terms, creatorLockedLP: 50 });
  assert.deepEqual(changed.filter(row => !row.matches).map(row => row.name), ['Creator permanently locked LP']);
  // Equal headline fees must not hide different recipients or first-buyer economics.
  const changedRecipients = comparePlan(chosen, { ...terms, creatorMigrationShare: 50, creatorTradingShare: 50, firstSwapAtMinimum: true, dynamicFee: true, feePeriod: '10 steps over 100 seconds' });
  assert.deepEqual(changedRecipients.filter(row => !row.matches).map(row => row.name), [
    'Fee reduction schedule', 'First swap at minimum fee', 'Dynamic fee',
    'Creator trading fee share', 'Creator graduation fee share',
  ]);
  const noTake = { ...chosen, migrationFeePercent: 0 };
  const noTakeTerms = { ...terms, migrationFee: 0, creatorMigrationShare: 50 };
  assert.equal(comparePlan(noTake, noTakeTerms).find(row => row.name === 'Creator graduation fee share')?.matches, true);
});

test('rejects an invalid fee schedule before generating a launch transaction', () => {
  const design = { ...DEFAULT_DESIGN, startFeeBps: 50, endFeeBps: 100 };
  assert.ok(validateDesign(design).some(error => error.includes('exceed')));
  assert.throws(() => buildConfig(design));
});
