import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { buildConfig, DEFAULT_DESIGN } from '../src/studio.ts';
import { readTermsFromConnection } from '../src/chain.ts';
import { comparePlan } from '../src/compare.ts';
import {
  deriveDbcPoolAddress, DYNAMIC_BONDING_CURVE_PROGRAM_ID,
  DynamicBondingCurveClient,
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
// Use the exact production builder rather than a separately recreated config.
const curve = buildConfig(DEFAULT_DESIGN);

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

// Read through the same reader/decoder used by the app, then compare all selected terms.
const receipt = await readTermsFromConnection(pool.toBase58(), connection);
const comparison = comparePlan(DEFAULT_DESIGN, receipt.terms);
assert.equal(comparison.length, 24);
assert.ok(comparison.every(row => row.matches), JSON.stringify(comparison.filter(row => !row.matches)));
const changedPlan = comparePlan({ ...DEFAULT_DESIGN, threshold: 3 }, receipt.terms);
assert.deepEqual(changedPlan.filter(row => !row.matches).map(row => row.name), ['Graduation threshold']);
await assert.rejects(readTermsFromConnection('not-a-solana-address', connection), /valid Solana/);
await assert.rejects(readTermsFromConnection(Keypair.generate().publicKey.toBase58(), connection), /No account exists/);
await assert.rejects(readTermsFromConnection(payer.publicKey.toBase58(), connection), /not owned by the Meteora DBC/);

// Reproduce the fee-recipient regression with a real program account, not edited terms.
const feeDesign = { ...DEFAULT_DESIGN, migrationFeePercent: 15 };
const feeCurve = buildConfig(feeDesign);
const splitConfig = Keypair.generate();
const splitTx = await client.partner.createConfig({
  ...feeCurve,
  migrationFee: { feePercentage: 15, creatorFeePercentage: 50 },
  config: splitConfig.publicKey, feeClaimer: payer.publicKey,
  leftoverReceiver: payer.publicKey, payer: payer.publicKey, quoteMint: NATIVE_MINT,
});
const splitSignature = await send(splitTx, splitConfig);
const splitReceipt = await readTermsFromConnection(splitConfig.publicKey.toBase58(), connection);
const splitComparison = comparePlan(feeDesign, splitReceipt.terms);
assert.equal(splitReceipt.terms.migrationFee, 15);
assert.equal(splitReceipt.terms.creatorMigrationShare, 50);
assert.deepEqual(splitComparison.filter(row => !row.matches).map(row => row.name), ['Creator graduation fee share']);

const proof = {
  result: 'LOCALNET_PRODUCTION_FLOW_VERIFIED',
  time: new Date().toISOString(), network: 'localnet', genesis,
  sdk: '1.5.13', program: DYNAMIC_BONDING_CURVE_PROGRAM_ID.toBase58(),
  config: config.publicKey.toBase58(), pool: pool.toBase58(), mint: mint.publicKey.toBase58(),
  configSignature, poolSignature,
  receipt: { ...receipt, network: 'localnet' },
  comparison,
  changedDraft: changedPlan.filter(row => !row.matches),
  rejectionChecks: ['invalid address', 'missing account', 'wrong program owner'],
  feeRecipientRegression: {
    config: splitConfig.publicKey.toBase58(), signature: splitSignature,
    headlineFeePercent: splitReceipt.terms.migrationFee,
    creatorFeeSharePercent: splitReceipt.terms.creatorMigrationShare,
    mismatches: splitComparison.filter(row => !row.matches),
  },
  observed: { thresholdLamports: onchainConfig.migrationQuoteThreshold.toString(),
    migrationFeePercentage: onchainConfig.migrationFeePercentage,
    creatorPermanentLockedLP: onchainConfig.creatorPermanentLockedLiquidityPercentage,
    tokenUpdateAuthority: onchainConfig.tokenUpdateAuthority,
    poolConfig: onchainPool.poolState.config.toBase58(),
    poolCreator: onchainPool.poolState.creator.toBase58() },
};
writeFileSync('proof.json', JSON.stringify(proof, null, 2) + '\n');
console.log(JSON.stringify(proof, null, 2));
