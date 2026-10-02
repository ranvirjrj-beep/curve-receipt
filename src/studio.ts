import {
  ActivationType,
  BaseFeeMode,
  buildCurve,
  CollectFeeMode,
  deriveDbcPoolAddress,
  DynamicBondingCurveClient,
  MigrationFeeOption,
  MigrationOption,
  TokenAuthorityOption,
  TokenDecimal,
  TokenType,
  type ConfigParameters,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { NATIVE_MINT } from '@solana/spl-token';
import { Connection, Keypair, type Transaction } from '@solana/web3.js';
import { RPC } from './chain';

export type Design = {
  threshold: number;
  supply: number;
  migrationSupplyPercent: number;
  startFeeBps: number;
  endFeeBps: number;
  feeDurationSeconds: number;
  creatorUnlockedLP: number;
  migrationFeePercent: number;
};

export const DEFAULT_DESIGN: Design = {
  threshold: 2,
  supply: 100_000_000,
  migrationSupplyPercent: 20,
  startFeeBps: 100,
  endFeeBps: 100,
  feeDurationSeconds: 0,
  creatorUnlockedLP: 0,
  migrationFeePercent: 0,
};

// Current devnet genesis hash from Anza's cluster configuration.
const DEVNET_GENESIS = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';

export function validateDesign(d: Design): string[] {
  const errors: string[] = [];
  const range = (name: string, value: number, min: number, max: number) => {
    if (!Number.isFinite(value) || value < min || value > max) errors.push(`${name} must be between ${min} and ${max}.`);
  };
  range('Graduation threshold (SOL)', d.threshold, 0.1, 1000);
  range('Supply', d.supply, 100_000, 1_000_000_000_000);
  range('Migration supply', d.migrationSupplyPercent, 1, 90);
  range('Opening fee', d.startFeeBps, 25, 9900);
  range('Ending fee', d.endFeeBps, 25, 9900);
  range('Fee duration', d.feeDurationSeconds, 0, 604800);
  range('Creator non-permanent LP', d.creatorUnlockedLP, 0, 90);
  range('Graduation fee', d.migrationFeePercent, 0, 99);
  if (d.endFeeBps > d.startFeeBps) errors.push('Ending fee cannot exceed opening fee.');
  if ((d.startFeeBps === d.endFeeBps) !== (d.feeDurationSeconds === 0)) errors.push('Use duration 0 for a fixed fee; set a positive duration when the fees differ.');
  if (d.feeDurationSeconds !== 0 && (d.feeDurationSeconds < 10 || d.feeDurationSeconds % 10 !== 0)) errors.push('Fee reduction duration must be a multiple of 10 seconds (at least 10).');
  if (!Number.isInteger(d.migrationFeePercent) || !Number.isInteger(d.creatorUnlockedLP)) errors.push('Graduation fee and LP percentages must be whole numbers.');
  return errors;
}

export function buildConfig(d: Design): ConfigParameters {
  const errors = validateDesign(d);
  if (errors.length) throw new Error(errors.join(' '));
  // The official Meteora SDK computes the curve, token amounts and fee parameters.
  return buildCurve({
    token: {
      tokenType: TokenType.SPLToken,
      tokenBaseDecimal: TokenDecimal.SIX,
      tokenQuoteDecimal: TokenDecimal.NINE,
      tokenAuthorityOption: TokenAuthorityOption.Immutable,
      totalTokenSupply: d.supply,
      leftover: 0,
    },
    fee: {
      baseFeeParams: {
        baseFeeMode: BaseFeeMode.FeeSchedulerLinear,
        feeSchedulerParam: {
          startingFeeBps: d.startFeeBps,
          endingFeeBps: d.endFeeBps,
          numberOfPeriod: d.feeDurationSeconds ? 10 : 0,
          totalDuration: d.feeDurationSeconds,
        },
      },
      dynamicFeeEnabled: false,
      collectFeeMode: CollectFeeMode.QuoteToken,
      creatorTradingFeePercentage: 100,
      poolCreationFee: 0,
      enableFirstSwapWithMinFee: false,
    },
    migration: {
      migrationOption: MigrationOption.MET_DAMM_V2,
      migrationFeeOption: MigrationFeeOption.FixedBps25,
      migrationFee: {
        feePercentage: d.migrationFeePercent,
        creatorFeePercentage: d.migrationFeePercent ? 100 : 0,
      },
    },
    liquidityDistribution: {
      partnerLiquidityPercentage: 0,
      partnerPermanentLockedLiquidityPercentage: 0,
      creatorLiquidityPercentage: d.creatorUnlockedLP,
      creatorPermanentLockedLiquidityPercentage: 100 - d.creatorUnlockedLP,
    },
    lockedVesting: {
      totalLockedVestingAmount: 0,
      numberOfVestingPeriod: 0,
      cliffUnlockAmount: 0,
      totalVestingDuration: 0,
      cliffDurationFromMigrationTime: 0,
    },
    activationType: ActivationType.Timestamp,
    percentageSupplyOnMigration: d.migrationSupplyPercent,
    migrationQuoteThreshold: d.threshold,
  });
}

async function sendDevnet(connection: Connection, tx: Transaction, payer: Keypair, other: Keypair) {
  const latest = await connection.getLatestBlockhash('confirmed');
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = latest.blockhash;
  tx.sign(payer, other);
  const signature = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });
  const result = await connection.confirmTransaction({ signature, ...latest }, 'confirmed');
  if (result.value.err) throw new Error(`Devnet transaction failed: ${JSON.stringify(result.value.err)}`);
  return signature;
}

/** An ephemeral browser-only devnet demo. No key leaves this tab and no mainnet funds are used. */
export async function launchDevnetDemo(d: Design, onStep: (message: string) => void, endpoint?: string) {
  const curve = buildConfig(d);
  const connection = new Connection(endpoint?.trim() || RPC.devnet, 'confirmed');
  if (await connection.getGenesisHash() !== DEVNET_GENESIS) throw new Error('RPC endpoint is not the expected Solana devnet. No transaction was sent.');
  const client = DynamicBondingCurveClient.create(connection, 'confirmed');
  const payer = Keypair.generate();
  const config = Keypair.generate();
  const mint = Keypair.generate();
  onStep(`Funding disposable devnet wallet ${payer.publicKey.toBase58()} from the faucet…`);
  const drop = await connection.requestAirdrop(payer.publicKey, 250_000_000);
  await connection.confirmTransaction(drop, 'confirmed');

  onStep('Creating the DBC config from the reviewed terms…');
  const createConfig = await client.partner.createConfig({
    ...curve,
    config: config.publicKey,
    feeClaimer: payer.publicKey,
    leftoverReceiver: payer.publicKey,
    payer: payer.publicKey,
    quoteMint: NATIVE_MINT,
  });
  const configSignature = await sendDevnet(connection, createConfig, payer, config);

  onStep('Launching a sample token and virtual DBC pool…');
  const createPool = await client.creator.createPool({
    baseMint: mint.publicKey,
    config: config.publicKey,
    name: 'CurveReceipt Demo',
    symbol: 'CRD',
    uri: 'https://curve-receipt.ranvirjroyal.chatgpt.site/sample-token.json',
    payer: payer.publicKey,
    poolCreator: payer.publicKey,
  });
  const poolSignature = await sendDevnet(connection, createPool, payer, mint);
  const pool = deriveDbcPoolAddress(NATIVE_MINT, mint.publicKey, config.publicKey);
  onStep('Reading both accounts back from Meteora DBC…');
  const [configState, poolState] = await Promise.all([
    client.state.getPoolConfig(config.publicKey),
    client.state.getPool(pool),
  ]);
  if (!configState || !poolState) throw new Error('Transactions confirmed, but the new DBC accounts could not be read. Keep the signatures for verification.');
  return {
    config: config.publicKey.toBase58(),
    pool: pool.toBase58(),
    mint: mint.publicKey.toBase58(),
    configSignature,
    poolSignature,
    configState,
    poolState,
  };
}
