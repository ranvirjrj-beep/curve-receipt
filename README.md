# CurveReceipt

Latest status: technical prototype with an improved builder review flow and [presentation/validation gate](docs/PRESENTATION_AND_VALIDATION.md). Final submission readiness is on hold while external usefulness, distribution and entrant-specific requirements remain unverified. The earlier [pre-submission audit](docs/PRE_SUBMISSION_AUDIT_2026-10-02.md) records technical proof; it is not evidence of demand or payout likelihood. [Prepared submission copy](docs/SUBMISSION_PACKET.md) · [Project pitch](https://ranvirjrj-beep.github.io/curve-receipt/pitch.html).

Compare intended launch economics with a live Meteora Dynamic Bonding Curve (DBC) configuration. Built for launchpad engineers reviewing fee recipients and liquidity terms before linking a launch. The same headline migration fee can pay a different creator share; the local-program proof demonstrates this distinction.

**Live demo:** https://ranvirjrj-beep.github.io/curve-receipt · **Source and public checks:** https://github.com/ranvirjrj-beep/curve-receipt

## User journey

1. **Design** a fixed-supply SOL-quoted launch: quote threshold, supply, opening fee, migration fee and permanent LP lock. The official `buildCurve` helper produces a real DBC configuration; invalid curves are rejected. You can compare this editable draft with an independent live mainnet example in one click; this comparison is not a creator commitment.
2. **Optional devnet experiment** uses a temporary in-memory wallet, a 0.25 SOL devnet airdrop request, and the Meteora SDK to create a config and a virtual pool. Its shared faucet has repeatedly failed before a transaction. No public devnet launch is claimed. It does not submit any transaction on mainnet.
3. **Verify** takes a config or pool address on either network and reads `PoolConfig` and `VirtualPool` through the official SDK, including standard and transfer-hook variants. The result links to Solana Explorer and can be shared as a URL. No wallet connection is needed for inspection. An optional local draft comparison checks 24 selected economic terms, including fee timing, creator/partner fee shares, first-buyer discounts and LP allocation; it does not compare the entire curve or migration supply target; the draft is editable and is not an authenticated promise.

The read-only judge path requires a browser-accessible Solana RPC and no faucet. Only the optional devnet creation experiment requires a working faucet. Mainnet reads use the free PublicNode endpoint; devnet uses Solana's public endpoint. Every endpoint is checked against the selected network genesis. Public RPCs may reject or rate limit requests. A user can supply their own HTTPS RPC endpoint. The temporary wallet disappears with the tab. The receipt displays the RPC head slot observed after account reads, not an atomic snapshot slot; it does not attest who operates a token or what they will do later.

## Why this product

Meteora Invent already creates pools, live indexers stream DBC launches, and [meteora.fyi's config marketplace](https://meteora.fyi/marketplace/creator-share) already explains curated curves and fee/LP rights in plain language. CurveReceipt reads an arbitrary live DBC account and compares it with a local design draft. It surfaces who can claim fees, where leftover tokens go, first-buyer discounts, migration fees and recipients, and LP allocation/locks. The draft is unsigned, so it cannot prove a creator's earlier promise. Launchpad operators could link a receipt beside a token listing; buyer demand, partner integration and a paid business model have not been established.

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

- Pinned-SDK builder and economic regression checks pass. The [build workflow](https://github.com/ranvirjrj-beep/curve-receipt/actions/workflows/build.yml) checks the current source.
- The application's production reader successfully [read a real mainnet config](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36980040009) at RPC head slot 452546095. The saved [receipt and comparison](docs/proof/mainnet-production-read.json) show **11/24 selected matches** with the default draft. This independent config is not a launch created by CurveReceipt.
- The production builder, reader, decoder and comparison passed a [real local-program write/read test](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36980040043). The official Meteora program fixture is pinned at SDK source commit `a28b7239e71899eb52ff7aacac4dec90441885c4`. Real config and pool transactions produce 24/24 matches; a changed draft identifies the threshold difference. A second real config with a 15% headline fee and 50% creator share correctly differs from a 100% creator-share draft. Invalid address, missing account and wrong owner are rejected. [Full evidence](docs/proof/localnet-production-flow.json). Local transaction signatures cannot be verified on public Explorer.
- A [real Chromium browser journey](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/37005781238) passed live mainnet comparison, share URL and fresh-tab reread, mobile layout, invalid input and wrong-network errors. No RPC responses were mocked. The test serves the production bundle locally in CI; it is not a claim of testing the hosted site's transport. It exposed and led to fixing the original default mainnet RPC's browser-side 403.
- The optional public devnet experiment remains faucet-dependent. Attempts failed before config creation. No public devnet launch, swap, DAMM migration, mainnet write, user traction, customer validation or revenue is claimed.
- The earlier frozen [release review](docs/RELEASE_REVIEW_2026-10-02.md) preserves the state before these repairs. The subsequent [completion review](docs/COMPLETION_REVIEW_2026-10-02.md) records current proof and remaining entry/market risks. [Submission copy](docs/SUBMISSION_PACKET.md) is prepared, but no submission is confirmed.

## Reproduce the program write/read proof locally

With Node 22+, Solana CLI/test-validator v3.1.10, and no public-network SOL:

1. Run `npm ci` in this project.
2. Get the official SDK source at commit `a28b7239e71899eb52ff7aacac4dec90441885c4`.
3. Start `solana-test-validator --reset --bpf-program dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN <sdk>/packages/dynamic-bonding-curve/tests/fixtures/dynamic_bonding_curve.so --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s <sdk>/packages/dynamic-bonding-curve/tests/fixtures/metaplex.so`.
4. Run `node --import tsx proof/localnet.mjs`. The script asserts the real config and pool state and writes `proof.json`.

The reproducible CI setup is in [`.github/workflows/localnet-proof.yml`](https://github.com/ranvirjrj-beep/curve-receipt/blob/main/.github/workflows/localnet-proof.yml) and its public action logs. `proof/localnet.mjs` contains no wallet secret; every run generates a temporary signer.

**Recorded demo:** [77-second continuous technical walkthrough](https://ranvirjrj-beep.github.io/curve-receipt/CurveReceipt-current-technical-demo.mp4) · [Recording provenance](public/CURVERECEIPT_CURRENT_DEMO_PROVENANCE.md). The current recording shows the tested source served locally in CI, with live mainnet RPC. The older 73-second recording remains historical evidence in `docs/proof/demo-provenance.json`.

## Browser reproduction and demo

```sh
npm ci
npx playwright install --with-deps chromium
npm run build
npx playwright test
```

The three journey tests have no mocked RPC data and no automatic retries. `tests/browser/demo.spec.ts` separately records a deliberately paced live-account walkthrough. Every browser run saves its screenshots, videos and traces as a GitHub Actions artifact. Live network availability can change after a successful run.

## References

- [Meteora DBC product](https://docs.meteora.ag/core-products/dbc/what-is-dbc)
- [Meteora DBC SDK examples](https://docs.meteora.ag/developer-guides/dbc/typescript-sdk/examples)
- [Meteora account and permission guide](https://docs.meteora.ag/core-products/dbc/accounts-and-permissions)
- [Anza devnet cluster and genesis hash](https://docs.anza.xyz/clusters/available)
- [Meteora side track](https://superteam.fun/earn/listing/meteora-dbc)
- [Colosseum official hackathon rules](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf)

## License

MIT. This project uses Meteora's SDK under its own license; no SDK source is copied into this repository.

