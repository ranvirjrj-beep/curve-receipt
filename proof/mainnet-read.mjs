import { writeFileSync } from 'node:fs';
import { Connection, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient, DYNAMIC_BONDING_CURVE_PROGRAM_ID } from '@meteora-ag/dynamic-bonding-curve-sdk';

const address = new PublicKey('69xxfUPhKAUBFHhsjGMKdoCp9iordjvWktvdJRHAbz3y');
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const genesis = await connection.getGenesisHash();
if (genesis !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') throw new Error('Unexpected mainnet genesis hash');
const client = DynamicBondingCurveClient.create(connection, 'confirmed');
const [config, account, slot] = await Promise.all([
  client.state.getPoolConfig(address),
  connection.getAccountInfo(address),
  connection.getSlot('confirmed'),
]);
if (!config) throw new Error('Meteora SDK could not decode the selected mainnet config');
if (!account?.owner.equals(DYNAMIC_BONDING_CURVE_PROGRAM_ID)) throw new Error('Unexpected account owner');
const result = {
  result: 'MAINNET_DBC_CONFIG_READ_VERIFIED',
  address: address.toBase58(),
  slot, genesis,
  program: account.owner.toBase58(),
  quoteMint: config.quoteMint.toBase58(),
  feeClaimer: config.feeClaimer.toBase58(),
  migrationFeePercentage: config.migrationFeePercentage,
  creatorMigrationFeePercentage: config.creatorMigrationFeePercentage,
  migrationQuoteThresholdBaseUnits: config.migrationQuoteThreshold.toString(),
  partnerLiquidityPercentage: config.partnerLiquidityPercentage,
  creatorLiquidityPercentage: config.creatorLiquidityPercentage,
  partnerLockedPercentage: config.partnerPermanentLockedLiquidityPercentage,
  creatorLockedPercentage: config.creatorPermanentLockedLiquidityPercentage,
  tokenAuthority: config.tokenUpdateAuthority,
  firstSwapMinFee: config.enableFirstSwapWithMinFee,
};
writeFileSync('mainnet-read.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
