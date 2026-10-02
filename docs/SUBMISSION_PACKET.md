# CurveReceipt — submission copy

Prepared on 2 October 2026. This copy is for a developer-tooling prototype entry. Registration and account-specific submission fields have not been verified; this document is not a submission confirmation.

## Project name

CurveReceipt

## Short description

Compare a launch builder's selected draft economics with a live Meteora DBC config or pool, without connecting a wallet.

## Problem and intended user

A launchpad builder needs to check the configuration they are about to link against the economics they intended: fee timing, graduation fees and recipients, trading-fee shares, and liquidity allocation. A headline fee alone can conceal a different recipient split. The builder should be able to inspect an arbitrary DBC account and see specific differences before presenting the launch to users.

## What works

CurveReceipt models a fixed-supply SOL-quoted launch using Meteora's official curve builder. It reads a live mainnet or devnet config/pool using the official SDK, checks canonical program ownership and the RPC network genesis, translates the configuration into a readable receipt, and compares 24 selected economic terms against a saved local draft. Receipts include source-account Explorer links and a share URL. The draft remains in its originating tab and is not represented as a signed promise.

The documented integration proof executes real config and pool transactions against Meteora's official program fixture in an ephemeral local Solana validator. It then uses the application's production reader and comparison code, asserting 24/24 intended matches, a changed-threshold mismatch, and a real fee-recipient mismatch. Those local signatures are not public devnet or mainnet transactions. A separate production-reader proof reads an independent existing mainnet account.

## Meteora integration

Pinned SDK: `@meteora-ag/dynamic-bonding-curve-sdk@1.5.13`. Curve construction uses `buildCurve`; account inspection uses `DynamicBondingCurveClient.state`; the optional devnet experiment uses config/pool creation transactions. The mainnet path is read-only. DAMM v2 is an intended migration destination encoded in the configuration; completed swaps or DAMM migration have not been demonstrated.

## Difference from available tools

Existing Meteora creation tools and the meteora.fyi marketplace already offer launch creation and readable curated configurations. CurveReceipt's narrower contribution is a selected-term comparison between an editable builder draft and an arbitrary live config or pool. Demand for that comparison has not yet been validated. We do not claim that this is the first economic receipt or a full curve audit.

## Links

- Product: https://curve-receipt.ranvirjroyal.chatgpt.site
- Recorded demo: https://curve-receipt.ranvirjroyal.chatgpt.site/demo.mp4
- Browser/demo proof: https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/37005781238
- Public source, MIT license, proof and checks: https://github.com/ranvirjrj-beep/curve-receipt
- Production mainnet proof: https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36980040009
- Production local-program proof: https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36980040043
- Evidence JSON: `docs/proof/mainnet-production-read.json` and `docs/proof/localnet-production-flow.json`

## Honest limits

This is a prototype. There are no verified active users, paying customers, revenue, launch volume, or partner integrations. The mainnet example is independent of this project. Public devnet creation has been blocked by faucet failures before sending a config transaction. The comparison covers selected economic terms, not every curve point, the migration supply target, or account authorship. A receipt relies on its RPC response and does not establish creator honesty, token safety, or an atomic account snapshot.

## Immediate judge path

Open Design a launch, review the 2 SOL default threshold and permanent LP allocation, then use Compare with a live mainnet example. Read the actual selected-term differences, graduation recipients and source links. Share the receipt and open the URL in a fresh tab: the live account is reread, and the unsigned draft is absent. See the linked local-program proof for actual config/pool creation and comparison regression evidence.

## Information requiring the entrant

The entrant must verify their age and personal eligibility, existing Colosseum team/project status, correct registration, payout identity/address, and any legal acceptance. Do not invent these facts. The Superteam Submit Now action currently exposes a sign-in wall; actual account-specific form fields remain unreviewed. No entry has been submitted by this work.
