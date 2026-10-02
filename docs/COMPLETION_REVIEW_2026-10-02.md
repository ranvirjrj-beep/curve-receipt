# CurveReceipt — completion and pre-submission review

Recorded on 2 October 2026 before submission. This supersedes the engineering status in the earlier frozen review; that earlier record remains unchanged.

## Decision

**GO for preserving and publishing the repaired developer-tooling prototype and truthful demonstration. HOLD formal submission until the account-specific rules, registration and form have been checked. NO-GO for further feature expansion or spending to chase this prize.**

The central product claim now has end-to-end proof: model a draft with the official SDK, read an independent mainnet account in a real browser, compare 24 selected terms, share the account URL and reread it without a wallet. This establishes technical functionality. It does not establish product demand, traction or strong prize likelihood.

## Thesis and competitive assessment

A launchpad builder can use an arbitrary-account receipt to catch differences between intended and configured fee timing, recipient shares and liquidity rights before linking a launch. The narrow differentiator is selected-term draft-versus-chain comparison. Meteora Invent and the official scaffold already create launches; meteora.fyi already explains curated configurations and fee/LP rights. Mere readable economics is therefore insufficient differentiation. No builder interview, embedded partner integration, paying buyer or current comparable winning entry was verified. No numeric win probability is supported.

## Proof ledger

| Claim | Evidence | Boundary |
| --- | --- | --- |
| Production builder, reader, decoder and comparison agree | [Local program run](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36980040043), `docs/proof/localnet-production-flow.json` | Actual transactions against the official fixture; ephemeral local validator, not public devnet or mainnet |
| Intended local account matches draft | 24/24 selected checks; a changed threshold produces the expected single mismatch | Full curve and migration supply target remain outside comparison |
| Recipient regression is fixed | Real second config: total graduation fee 15%, creator recipient share 50%; draft expecting 100% correctly differs | Earlier erroneous headline-fee equivalence no longer passes |
| Wrong inputs are rejected | Invalid address, missing account, system-program owner; browser rejects mismatched network genesis | RPC responses remain trusted data, not cryptographic attestations |
| Real mainnet configuration is decoded by production code | [Mainnet run](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36980040009), observed head slot 452546095 | Independent existing config, read-only, not an atomic snapshot |
| Actual browser user journey works | [Final source browser run](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/37005781238): three journey tests and a paced demo pass, no mock RPC data or automatic retries | CI serves the production bundle locally; hosted production transport was not browser-tested because supervised preview access was blocked |
| Desktop and mobile remain usable | Browser screenshots and checks include full comparison values fitting within each mobile row | Visual checks concern the recorded viewport sizes |
| Source typechecks and builds | [Final source build run](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/37005781110) | SDK bundle-size warning remains a performance consideration, not a build failure |

## Mistakes repaired and verification changes

The earlier proof used SDK calls without exercising the actual application reader/comparison. That verification gap allowed misleading recipient comparison and failed to expose the mainnet RPC's browser-side 403. Production code now participates in both proof scripts. Real browser CI exposed the access failure; the default mainnet provider changed to the documented free PublicNode service. All default and custom RPC endpoints must report the expected genesis. Clipboard failures now show a useful error. Mobile comparison displays both values without horizontal clipping.

These checks reduce known errors; they do not justify claiming that every possible input or future network condition is error-free.

## Requirements review

The [Meteora listing](https://superteam.fun/earn/listing/meteora-dbc) advertises developer tooling, five paid places and a 20,000 USDC pool: 10,000 / 5,000 / 3,000 / 1,500 / 500. Selection is competitive; prizes are stablecoin opportunity amounts, not received bank cash. Judging covers integration depth, technical execution, originality, impact and traction, with a stated preference for mainnet-live products with active users.

The [official main hackathon rules](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf) require registration, timely project upload, personal eligibility and one team/project at a time. India is not in the excluded-location list. The rules set 12 October 2026 at 23:59 Pacific, corresponding to **13 October 2026 at 12:29 IST**. A separate side-track cutoff was not conclusively resolved; do not assume more time. The side listing's 31 October announcement and main event's by-5-December announcement are separate schedules, not payment dates.

The Superteam Submit Now action exposes a sign-in wall. Account registration, exact form fields, individual attestations, payout identity and legal acceptance have not been verified. Prepared English copy is in `docs/SUBMISSION_PACKET.md`. No submission is confirmed.

## Three strongest remaining rejection risks

1. **Unvalidated differentiation and impact.** Existing tools already explain launch economics; no actual builder has shown demand for this particular draft comparison. An unsigned draft cannot authenticate a creator promise.
2. **Limited integration breadth and operation.** Mainnet inspection and local config/pool transactions are proven. Public creation, swaps, completed graduation/migration and partner usage are not. A declared DAMM destination is not migration proof.
3. **No traction.** No verified active users, paid customer, revenue or launch volume. The sponsor prefers real mainnet usage. Hosting a prototype and reading another project's account do not satisfy that preference.

These are our pre-submission inferences, not sponsor rejection reasons. Account-specific requirements remain a separate administrative blocker. Do not describe this as submission-ready while that blocker remains.

## Money and time

New out-of-pocket spend: **0**. Real SOL spent: **0**. Cash received: **0**. Contractually due: **0**. Awarded prize: **0**. Submitted/pending prize: **0**, because no entry is confirmed. Advertising a prize does not create an amount owed.

The available engineering work is frozen after proof, demo, copy and publication. Remaining account verification/submission timing depends on authentication and the actual form; no reliable completion time or payout date is established. Recommendation: finish that identity/rules check if proceeding, submit only truthful claims, and spend no additional time manufacturing traction or expanding features for this unvalidated opportunity.
