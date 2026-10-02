# CurveReceipt — release and opportunity review

Decision recorded on 2 October 2026, before any submission. This is an engineering and opportunity assessment, not a sponsor decision.

**Recommendation: NO-GO for submission in its current state. Preserve the working prototype and the fixes; pause feature expansion until the gaps below can be resolved without spending money.**

## Thesis and evidence

Hypothesis: launchpad builders will choose a receipt that compares an arbitrary DBC config or virtual pool with their intended economics and identifies differences in fee recipients, fee timing and liquidity rights. The inspectable differentiator is a local-draft comparison, now covering 24 selected economic terms. Demand for that comparison and willingness to pay have not been verified.

The draft is unsigned and editable. A match does not authenticate a creator's promise, compare the full bonding curve, or establish that a token is safe. The migration supply target is not part of the selected-term comparison. RPC head slot is not an atomic account-snapshot slot. A mainnet account read is not our own mainnet launch or user traction.

## Official opportunity facts checked

| Item | Evidence / status |
| --- | --- |
| Sponsor and scope | [Meteora side track](https://superteam.fun/earn/listing/meteora-dbc), developer tooling is one of the suggested ideas. |
| Payment | Advertised pool: 20,000 USDC. Five paid places: 10,000 / 5,000 / 3,000 / 1,500 / 500 USDC. Stablecoin prizes, not bank cash already received; not infrastructure credits or a guaranteed grant. |
| Location | Listing says Global. India is not in the [Colosseum rules](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf)' excluded-location list; age, sanctions and other individual conditions still apply. |
| Cost to enter | Colosseum rules state no purchase necessary. No new out-of-pocket spending or paid-network transaction was made during this continuation. |
| Contest deadline | Official Colosseum rules: 12 October 2026, 23:59 Pacific, corresponding to 13 October, 12:29 IST. A separate side-track deadline was not independently exposed in the retrieved listing; use the earlier official cutoff until confirmed. |
| Announcement | Side-track listing says 31 October 2026. The main Colosseum rules separately say by 5 December 2026. These are different awards; neither is a payment-received date. |
| Judging | Listing: depth of Meteora integration, technical execution, originality/taste, impact potential, traction/volume. It explicitly prefers mainnet-live projects with active users. |
| Code | Public [source](https://github.com/ranvirjrj-beep/curve-receipt), MIT license and pinned SDK dependencies. Closed-source entries must grant the named judge read access; our public repository does not need that workaround. |
| Registration / submission | Not verified in the account UI. Colosseum rules require registration and timely project upload, and limit an entrant to one team/project at a time. Do not infer registration from a working demo. Side-track submission form fields and any separate required assets remain unchecked. |
| Comparable winners | No comparable winning entry for this current side track was established. Existing products below are substitutes, not asserted winners. |

The sponsor brief and detailed judging language were inspected in the rendered listing, because the text retrieval omitted its detailed description.

## Proof and validation

| Claim | Inspectable evidence | Limit |
| --- | --- | --- |
| Build and economic calculations work | Latest public [build run](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36975931801) before this change succeeded. This continuation reran `npm test` and `npm run build`; both passed after the comparison fix. | Automated checks are not browser checks. |
| Official SDK reads a real mainnet config | Successful [mainnet read proof](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36972802419), `proof/mainnet-read.mjs`. | Read-only script; not browser interaction, a new launch, or an atomic snapshot. |
| Real DBC config and pool transactions can execute | Successful [local-validator proof](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/36972800960), official program fixture and `proof/localnet.mjs`. | Ephemeral local validator. Public Explorer cannot verify those signatures. No swap or DAMM migration proof is claimed. |
| Selected-term comparison detects different economics | Regression assertions cover equal headline migration fees with different creator shares, altered fee timing, first-swap discounts, dynamic fees, trading-fee shares, and LP changes. | Synthetic test inputs; no new browser or public-network write proof. |
| Browser flow works | **Not passed.** Supervised preview reported running, but the browser rejected access with `ERR_BLOCKED_BY_CLIENT`. | Environment limitation; neither proof of an application failure nor evidence that it works. |
| Public devnet creation works | **Not established.** Prior attempts failed at the public faucet before config creation. | No public devnet config/pool transaction is claimed. Further repeated faucet requests were not used as a strategy. |

## Direct substitutes checked

[Meteora's config marketplace](https://meteora.fyi/marketplace/creator-share) already provides readable fee/LP rights, buyer simulations and deployable recipes. [Meteora Invent](https://docs.meteora.ag/invent/actions) and the official scaffold already cover creation workflows. Explaining configuration values or wrapping the SDK is therefore an insufficient novelty claim by itself.

CurveReceipt's narrower difference is comparing a builder's selected draft terms with an arbitrary on-chain config/pool. This is a plausible tooling use case, not established product-market fit. No partner has been shown embedding the receipt, no active-user count is supported, and no paid business model is validated.

## Three strongest rejection risks

1. **Competitive differentiation and impact remain weak.** An existing ecosystem marketplace already explains configurations. Our added comparison has not been validated with builders, and the editable draft cannot establish a creator's prior commitment.
2. **Integration and demonstration remain incomplete.** Config/pool write-read proof exists locally, but no browser mainnet flow, public devnet creation, completed swap/graduation flow or judge video is proven. The advertised DAMM destination is a config setting, not proof that migration completed.
3. **No real traction or buyer evidence.** The sponsor expressly prefers mainnet usage. A deployed website and another project's mainnet config do not establish usage of our product. There is no named paying customer or accepted payment obligation.

These are pre-submission risks inferred from the brief and current evidence. They are not claimed sponsor rejection reasons or numerical win probabilities.

## Changes made in this continuation

- Replaced the misleading comparison label "creator graduation take" with a total graduation fee and a separate creator share comparison. A 15% headline fee with a 50% creator share no longer appears equivalent to a 15% fee wholly paid to the creator.
- Expanded the selected-term comparison from 10 to 24 checks, including fee schedule, discount/dynamic-fee flags, partner allocations, vesting percentages and migrated-pool trading fee.
- Scoped the interface and README to selected terms rather than implying a complete curve comparison. Kept the editable-draft and unauthenticated-promise limits visible.
- Preserved BountyVault; this continuation changes only the separate CurveReceipt project.

## Reopen gate, time and money

Do not spend money to manufacture mainnet traction. Reopen only when the browser proof path is available and there is inspectable evidence that the comparison solves a builder's actual task. Then complete the account-specific requirements audit and a truthful demo using [the prepared walkthrough](./DEMO_WALKTHROUGH.md).

Estimated remaining engineering/demo work if infrastructure is available: 2–4 focused hours. User adoption, customer acceptance and sponsor selection have no verified completion time. This estimate is not a promise of submission readiness or payout.

Cash received for this project: **0**. Contractually due: **0**. Prize awarded or pending from a submitted entry: **0**; no submission is recorded. Advertised prizes are opportunity amounts only. New out-of-pocket spend during this continuation: **0**. Keep any later result separate from this frozen assessment and evaluate it against the evidence above.
