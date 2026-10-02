# CurveReceipt — submission copy

Updated on 2 October 2026 after reading the signed-in Meteora side-track form. This is prepared copy, not a submission confirmation. Personal attestations and the entrant's actual Colosseum status remain for the entrant to confirm.

## Exact Superteam field mapping

The form displays an `https://` prefix on URL inputs. Paste the full URL only if the form normalizes it; otherwise enter the host/path without duplicating the prefix. Check the displayed final URL before submitting.

| Form field | Required | Prepared value |
| --- | --- | --- |
| Link to Your Submission | Yes | https://curve-receipt.ranvirjroyal.chatgpt.site |
| Tweet Link | No | Leave blank; no public project tweet is verified |
| Project Name | Yes | CurveReceipt |
| Project Description | Yes | Use the field-ready description below |
| Project Github Link | Yes | https://github.com/ranvirjrj-beep/curve-receipt |
| Project Website | No | https://curve-receipt.ranvirjroyal.chatgpt.site |
| Project X Link | No | Leave blank; no project X account is verified |
| Pitch deck or Loom/video presentation | Yes | https://curve-receipt.ranvirjroyal.chatgpt.site/pitch.html — scrollable project pitch with the recorded technical demo |
| Submitted to official Colosseum hackathon? Yes/No | Yes | Entrant must confirm. No submission has been made by this workflow. Do not infer the entrant's independent account activity |
| Link to Colosseum project | No | Actual project URL only, if one exists |
| Link to project's Colosseum profile | No | Actual URL only, if one exists |
| Anything Else | No | Use the evidence/limitations copy below |
| Scope-compliance checkbox and final Submit | Yes | Entrant must review scope and terms; unchecked and unsubmitted |

## Field-ready project description

CurveReceipt is a wallet-free Meteora DBC review tool for launchpad builders. It models a fixed-supply SOL-quoted launch with Meteora's official SDK, reads an arbitrary mainnet/devnet config or pool, checks program ownership and RPC network, and compares 24 selected economic terms with an editable local draft. The receipt separates total graduation fees from creator/partner recipients, fee timing and LP allocations. Share links reread the live account; the unsigned draft remains in its originating tab.

The prototype has production-code local-validator config/pool transaction proof and a real-browser live-mainnet inspection demonstration. The mainnet example is independent; local signatures are not public chain transactions. No own mainnet launch, completed swaps/DAMM migration, active users or revenue is claimed. Differentiation and customer demand remain unvalidated. Source is public under MIT; implementation is AI-assisted.

## Field-ready Anything Else

Technical demo: https://curve-receipt.ranvirjroyal.chatgpt.site/demo.mp4

Evidence and recording provenance: https://github.com/ranvirjrj-beep/curve-receipt/tree/main/docs/proof

The pitch states a proposed builder-validation and distribution plan; outreach, partnerships and willingness to pay have not been verified. The recording predates a fee-precision correction; current code preserves SDK precision instead of rounding an ending fee before comparison. The comparison is limited to selected terms, trusts RPC responses and is not a token-safety audit or signed creator commitment.

## Main Colosseum entry is separate

The Superteam side-track FAQ requires a separate submission to each chosen side track. Neither the reviewed FAQ nor this Meteora listing expressly establishes mandatory prior Colosseum submission; the form accepts a Yes/No answer and marks the Colosseum URLs optional. This does not prove sponsor eligibility beyond the published wording. If submitting to Colosseum itself, its current FAQ additionally asks for registration, founder/team background and location, a logo/graphic, a 2–3 minute presentation, a product demo of at most 3 minutes and business/distribution context. The current 73-second technical video is not a completed founder presentation. Do not represent the main entry as ready or submitted.

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
- Project pitch: https://curve-receipt.ranvirjroyal.chatgpt.site/pitch.html
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

The entrant must verify personal eligibility, actual Colosseum team/project status and any legal acceptance. Payout identity/address must be correct if requested; none is requested in the reviewed side-track submission modal. Superteam sign-in has succeeded and the exact fields above were read. Payout timing and sponsor-specific verification requirements are not established. No entry has been submitted by this work.
