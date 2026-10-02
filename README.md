# CurveReceipt

Creator-side launch planner and independently readable terms receipt for Meteora Dynamic Bonding Curve (DBC) launches. Built for the Crypto World's Fair 2026 Meteora side track.

**Live demo:** https://curve-receipt.ranvirjroyal.chatgpt.site · **Source and public checks:** https://github.com/ranvirjrj-beep/curve-receipt

## User journey

1. **Design** a fixed-supply SOL-quoted launch: quote threshold, supply, opening fee, migration fee and permanent LP lock. The official `buildCurve` helper produces a real DBC configuration; invalid curves are rejected.
2. **Create & verify demo launch** uses a temporary in-memory wallet, a 0.25 SOL devnet airdrop request, and the Meteora SDK to create a config and a virtual pool. It confirms both transactions and reads both program accounts back. It does not submit any transaction on mainnet.
3. **Verify** takes a config or pool address on either network and reads `PoolConfig` and `VirtualPool` through the official SDK, including standard and transfer-hook variants. The result links to Solana Explorer and can be shared as a URL. No wallet connection is needed for inspection. An optional local draft comparison shows each match or mismatch; the draft is editable and is not an authenticated promise.

The demo requires a working devnet faucet and a browser-accessible Solana RPC. The default public RPC may rate limit requests. A user can supply their own HTTPS RPC endpoint. The temporary wallet disappears with the tab. The receipt displays the RPC head slot observed after account reads, not an atomic snapshot slot; it does not attest who operates a token or what they will do later.

## Why this product

Meteora Invent already creates pools, and live indexers already stream DBC launches. CurveReceipt connects the creator's intended terms to a public, independent account read. It surfaces who can claim fees, where leftover tokens go, whether the first buyer has a fee discount, the configured migration fee and its recipients, and how LP allocation and locks are split. Launchpad operators could link the receipt beside a token listing; trader-facing apps could embed the same read. Buyer demand and a paid business model have not been established.

## Local development

Node.js 22+ and npm:

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run build` typechecks and emits the static site in `dist/`. This site has no server-held wallet or API key. All chain reads and devnet writes are made from the visitor's browser.

The source uses `@meteora-ag/dynamic-bonding-curve-sdk@1.5.13`, `@solana/web3.js@1.98.4`, and `@solana/spl-token@0.4.15`. `src/studio.ts` builds configurations and the devnet sample, `src/chain.ts` performs account reads, and `src/terms.ts` translates account data to the receipt. The on-chain program ID is the official DBC program, `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN`.

## Proof status

- The pinned SDK builder creates the intended DAMM v2 curve offline. Automated tests check the exact 2 SOL threshold, 100% permanent LP lock, migration fee arithmetic, pool progress arithmetic, and invalid fee schedule rejection.
- The [public build and test run](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36973207278) passed on the released source.
- A [public read-only GitHub Actions run](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36972802419) successfully read the live mainnet DBC config `69xxfUPhKAUBFHhsjGMKdoCp9iordjvWktvdJRHAbz3y` through SDK 1.5.13 with RPC head slot 452526714 and verified that its account belongs to the canonical DBC program. The receipt can also be checked by pasting that address in the app.
- A [public GitHub Actions run](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36972800960) passed end to end on a local Solana validator running the **official Meteora program fixture** pinned at `MeteoraAg/dynamic-bonding-curve-sdk@a28b7239e71899eb52ff7aacac4dec90441885c4`. It funded a temporary account with local test SOL, confirmed a real DBC config transaction and pool transaction, reread the accounts, checked the program owner and verified the 2 SOL quote threshold, 0% migration fee, immutable token authority and 100% creator permanently locked LP. The validator is ephemeral: its transaction signatures cannot be looked up on public Solana Explorer.
- A separate workflow attempts the same operations on public devnet. Its faucet request failed with an RPC error before any config transaction was sent. A public devnet config/pool signature remains pending, and the site's one-click launch is subject to the same faucet availability.
- Mainnet read-through in a browser, devnet browser action, buyer validation, and a video are release gates; a local unit test does not substitute for any of them. The demo URL is public, but its one-click devnet creation still depends on the public faucet.

## Reproduce the program write/read proof locally

With Node 22+, Solana CLI/test-validator v3.1.10, and no public-network SOL:

1. Run `npm ci` in this project.
2. Get the official SDK source at commit `a28b7239e71899eb52ff7aacac4dec90441885c4`.
3. Start `solana-test-validator --reset --bpf-program dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN <sdk>/packages/dynamic-bonding-curve/tests/fixtures/dynamic_bonding_curve.so --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s <sdk>/packages/dynamic-bonding-curve/tests/fixtures/metaplex.so`.
4. Run `node proof/localnet.mjs`. The script asserts the real config and pool state and writes `proof.json`.

The reproducible CI setup is in [`.github/workflows/localnet-proof.yml`](https://github.com/ranvirjrj-beep/curve-receipt/blob/main/.github/workflows/localnet-proof.yml) and its public action logs. `proof/localnet.mjs` contains no wallet secret; every run generates a temporary signer.

## References

- [Meteora DBC product](https://docs.meteora.ag/core-products/dbc/what-is-dbc)
- [Meteora DBC SDK examples](https://docs.meteora.ag/developer-guides/dbc/typescript-sdk/examples)
- [Meteora account and permission guide](https://docs.meteora.ag/core-products/dbc/accounts-and-permissions)
- [Anza devnet cluster and genesis hash](https://docs.anza.xyz/clusters/available)
- [Meteora side track](https://superteam.fun/earn/listing/meteora-dbc)
- [Colosseum official hackathon rules](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf)

## License

MIT. This project uses Meteora's SDK under its own license; no SDK source is copied into this repository.
