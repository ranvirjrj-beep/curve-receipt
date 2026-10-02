import { Connection, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient, DYNAMIC_BONDING_CURVE_PROGRAM_ID } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { decodeTerms, type LaunchTerms } from './terms';

export const RPC = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
} as const;
export type Network = keyof typeof RPC;

export function makeConnection(network: Network, override?: string) {
  const endpoint = override?.trim() || RPC[network];
  if (!/^https:\/\//.test(endpoint)) throw new Error('RPC endpoint must use HTTPS.');
  return new Connection(endpoint, { commitment: 'confirmed', disableRetryOnRateLimit: true });
}

export async function inspect(
  address: string,
  network: Network,
  rpc?: string,
): Promise<{ terms: LaunchTerms; slot: number }> {
  let key: PublicKey;
  try { key = new PublicKey(address.trim()); }
  catch { throw new Error('Enter a valid Solana config or pool address.'); }

  const connection = makeConnection(network, rpc);
  if (rpc?.trim()) {
    const expected = network === 'mainnet'
      ? '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d'
      : 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
    if (await connection.getGenesisHash() !== expected) throw new Error(`RPC endpoint is not ${network}.`);
  }
  const queriedAccount = await connection.getAccountInfo(key);
  if (!queriedAccount) throw new Error('No account exists at this address on the selected network.');
  if (!queriedAccount.owner.equals(DYNAMIC_BONDING_CURVE_PROGRAM_ID)) {
    throw new Error('This account is not owned by the Meteora DBC program.');
  }
  const client = DynamicBondingCurveClient.create(connection, 'confirmed');
  // The SDK recognizes standard and transfer-hook accounts with their own discriminators.
  let config = await client.state.getPoolConfig(key).catch(() => null);
  let configAddress = key.toBase58();
  let pool = null;
  if (!config) {
    const account = await client.state.getPool(key);
    if (!account) throw new Error('No DBC config or pool exists at this address on the selected network.');
    pool = { address: key.toBase58(), account };
    configAddress = account.poolState.config.toBase58();
    const configAccount = await connection.getAccountInfo(account.poolState.config);
    if (!configAccount?.owner.equals(DYNAMIC_BONDING_CURVE_PROGRAM_ID)) {
      throw new Error('The linked config is missing or is not owned by the Meteora DBC program.');
    }
    config = await client.state.getPoolConfig(account.poolState.config);
    if (!config) throw new Error('Pool found, but its DBC config could not be read.');
  }

  let decimals = config.quoteMint.toBase58() === 'So11111111111111111111111111111111111111112' ? 9 : -1;
  if (decimals < 0) {
    try {
      const account = await connection.getParsedAccountInfo(config.quoteMint);
      const parsed = account.value?.data;
      if (parsed && 'parsed' in parsed) decimals = parsed.parsed.info.decimals;
    } catch { /* Raw units remain explicit when the quote mint cannot be resolved. */ }
  }
  const slot = await connection.getSlot('confirmed');
  return { terms: decodeTerms(config, configAddress, decimals, pool), slot };
}
