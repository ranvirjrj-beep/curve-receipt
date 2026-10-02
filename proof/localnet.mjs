import { writeFileSync } from 'node:fs';
import {
  ActivationType, BaseFeeMode, buildCurve, CollectFeeMode,
  deriveDbcPoolAddress, DYNAMIC_BONDING_CURVE_PROGRAM_ID,
  DynamicBondingCurveClient, MigrationFeeOption, MigrationOption,
  TokenAuthorityOption, TokenDecimal, TokenType,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { NATIVE_MINT } from '@solana/spl-token';
import { Connection, Keypair } from '@solana/web3.js';

const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
const genesis = await connection.getGenesisHash();
const client = DynamicBondingCurveClient.create(connection, 'confirmed');

const payer = Keypair.generate();
const config = Keypair.generate();
const mint = Keypair.generate();
console.log('Ephemeral local validator payer:', payer.publicKey.toBase58());
// Secret keys remain only in this process. They are never printed or uploaded.
const curve = buildCurve({
  token: { tokenType: TokenType.SPLToken, tokenBaseDecimal: TokenDecimal.SIX,
    tokenQuoteDecimal: TokenDecimal.NINE, tokenAuthorityOption: TokenAuthorityOption.Immutable,
    totalTokenSupply: 100_000_000, leftover: 0 },
  fee: { baseFeeParams: { baseFeeMode: BaseFeeMode.FeeSchedulerLinear,
    feeSchedulerParam: { startingFeeBps: 100, endingFeeBps: 100, numberOfPeriod: 0, totalDuration: 0 } },
    dynamicFeeEnabled: false, collectFeeMode: CollectFeeMode.QuoteToken,
    creatorTradingFeePercentage: 100, poolCreationFee: 0, enableFirstSwapWithMinFee: false },
  migration: { migrationOption: MigrationOption.MET_DAMM_V2,
    migrationFeeOption: MigrationFeeOption.FixedBps25,
    migrationFee: { feePercentage: 0, creatorFeePercentage: 0 } },
  liquidityDistribution: { partnerLiquidityPercentage: 0, partnerPermanentLockedLiquidityPercentage: 0,
    creatorLiquidityPercentage: 0, creatorPermanentLockedLiquidityPercentage: 100 },
  lockedVesting: { totalLockedVestingAmount: 0, numberOfVestingPeriod: 0, cliffUnlockAmount: 0,
    totalVestingDuration: 0, cliffDurationFromMigrationTime: 0 },
  activationType: ActivationType.Timestamp,
  percentageSupplyOnMigration: 20,
  migrationQuoteThreshold: 2,
});

// Local validator airdrops avoid public faucet rate limits.
const airdrop = await connection.requestAirdrop(payer.publicKey, 10_000_000_000);
await connection.confirmTransaction(airdrop, 'confirmed');
console.log('Local validator airdrop confirmed:', airdrop);

async function send(tx, signer) {
  const latest = await connection.getLatestBlockhash('confirmed');
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = latest.blockhash;
  tx.sign(payer, signer);
  const signature = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });
  const outcome = await connection.confirmTransaction({ signature, ...latest }, 'confirmed');
  if (outcome.value.err) throw new Error(`Transaction ${signature} failed: ${JSON.stringify(outcome.value.err)}`);
  return signature;
}

const configTx = await client.partner.createConfig({ ...curve, config: config.publicKey,
  feeClaimer: payer.publicKey, leftoverReceiver: payer.publicKey, payer: payer.publicKey, quoteMint: NATIVE_MINT });
const configSignature = await send(configTx, config);
console.log('DBC config tx:', configSignature);

const poolTx = await client.creator.createPool({ baseMint: mint.publicKey,
  config: config.publicKey, name: 'CurveReceipt Demo', symbol: 'CRD',
  uri: 'https://curve-receipt.ranvirjroyal.chatgpt.site/sample-token.json',
  payer: payer.publicKey, poolCreator: payer.publicKey });
const poolSignature = await send(poolTx, mint);
console.log('DBC pool tx:', poolSignature);

const pool = deriveDbcPoolAddress(NATIVE_MINT, mint.publicKey, config.publicKey);
const [onchainConfig, onchainPool, configAccount, poolAccount] = await Promise.all([
  client.state.getPoolConfig(config.publicKey), client.state.getPool(pool),
  connection.getAccountInfo(config.publicKey), connection.getAccountInfo(pool),
]);
if (!onchainConfig || !onchainPool) throw new Error('SDK readback of config or pool failed');
if (!configAccount?.owner.equals(DYNAMIC_BONDING_CURVE_PROGRAM_ID) ||
    !poolAccount?.owner.equals(DYNAMIC_BONDING_CURVE_PROGRAM_ID)) throw new Error('Wrong on-chain account owner');
if (!onchainPool.poolState.config.equals(config.publicKey)) throw new Error('Pool points to another config');
if (onchainConfig.migrationOption !== 1 || onchainConfig.migrationFeePercentage !== 0 ||
    onchainConfig.creatorPermanentLockedLiquidityPercentage !== 100 ||
    onchainConfig.migrationQuoteThreshold.toString() !== '2000000000') throw new Error('On-chain economics disagree with intent');

const proof = {
  result: 'LOCALNET_DBC_CONFIG_AND_POOL_VERIFIED',
  time: new Date().toISOString(), network: 'localnet', genesis,
  sdk: '1.5.13', program: DYNAMIC_BONDING_CURVE_PROGRAM_ID.toBase58(),
  config: config.publicKey.toBase58(), pool: pool.toBase58(), mint: mint.publicKey.toBase58(),
  configSignature, poolSignature,
  observed: { thresholdLamports: onchainConfig.migrationQuoteThreshold.toString(),
    migrationFeePercentage: onchainConfig.migrationFeePercentage,
    creatorPermanentLockedLP: onchainConfig.creatorPermanentLockedLiquidityPercentage,
    tokenUpdateAuthority: onchainConfig.tokenUpdateAuthority,
    poolConfig: onchainPool.poolState.config.toBase58(),
    poolCreator: onchainPool.poolState.creator.toBase58() },
};
writeFileSync('proof.json', JSON.stringify(proof, null, 2) + '\n');
console.log(JSON.stringify(proof, null, 2));
