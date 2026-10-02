# CurveReceipt — final side-track audit

2 October 2026, after the earlier completion review. Target: Meteora DBC side track on Superteam Earn. No submission confirmation exists.

## Decision

**Technical and content preparation: GO. Final submission: HOLD for the entrant's truthful Colosseum Yes/No answer and personal scope/terms acceptance.** The required project fields are populated in the signed-in Superteam review draft. The Yes/No field is blank, compliance is unchecked and Submit remains disabled. The laptop browser is a separate session; the prepared cloud-browser draft does not synchronize to it. Field-ready copy is in `SUBMISSION_PACKET.md`.

Do not describe this as a completed or accepted bounty. A technical pass does not establish prize likelihood or customer demand. No zero-error guarantee is justified.

## Current proof

Public GitHub implementation commit: `47022ccde274efab0fa3d662052f15062f59cf8e`. Site version 9 source commit: `79da35378ca597f1485d0fd350e03c9e187c1dd0`, successfully published at 12:54:42 UTC. The commits differ because the source repositories have independent history; edited implementation files were copied from the same checkout.

| Audit area | Result | Evidence and limit |
| --- | --- | --- |
| Fee precision regression | PASS | A valid fixed-fee config with numerator 10000001 previously decoded its ending fee to 100 bps, falsely matching a 100-bps draft. The test failed before correction and passes after preserving SDK precision. SDK-derived floating-point ending rates are not an independent on-chain arithmetic verifier |
| Unit tests, typecheck and production build | PASS | [Build run 37009590818](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/37009590818); 3 meaningful tests, including recipient and precision assertions |
| Production mainnet reader | PASS | [Run 37009590784](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/37009590784); 12:55:27 UTC, head slot 452616243, independent existing config; 11/24 default-draft matches; ending rate 100.21720133602321 bps |
| Actual official-program config/pool transactions | PASS | [Local run 37009590673](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/37009590673); 24/24 selected matches, deliberate threshold mismatch, second real recipient-share mismatch; invalid key, absent account and wrong owner rejected. Local signatures are not public-network proof |
| Real browser journey | PASS | [Run 37009590748](https://github.com/ranvirjrj-beep/curve-receipt/actions/runs/37009590748); all 4 tests pass, no retries or mocked RPC: live comparison, share/clipboard, fresh tab without draft, mobile layout, invalid design/address, wrong network, paced demo |
| Public submission URLs | PASS | Same browser run's separate HTTP check at 12:55:15 UTC: root, its 3 directly linked assets, pitch page, MP4 and token metadata return HTTP 200 from a GitHub hosted runner. This checks public transport separately from the local-bundle browser journey; it does not prove every network/browser will work |
| Video integrity | PASS | Public MP4 has content type video/mp4, 2611197 bytes and SHA256 e9d38a4baad9ff7868c54d087ec7a968730e80a456df9be1be9ddc3e0bdabcb3; 72.6 seconds. Original recording source and caption-only editing disclosure remain in demo-provenance.json |
| Source and claims | PASS with limits | Public MIT repository, exact SDK pin/lockfile, no signer secrets in project source; ephemeral devnet signer is generated in memory. Optional devnet success copy now states confirmed/read-back accounts rather than a stronger verification claim |
| Form review | COMPLETE, unsubmitted | Required website/source/video/name/description populated and URL prefixes visually checked. Optional X/tweet/Colosseum URLs left blank. Actual independent Colosseum account activity cannot be inferred |

Earlier managed-preview/runtime access failures were environment-specific. Public URL transport is now separately evidenced; a successful published status alone was not treated as judge-access proof. The captioned hosted demo is the earlier recording, with its original commit/time disclosed. It is not relabeled as a recording of the precision correction. The fresh browser run separately tests current code.

## Requirements and money review

The [Meteora listing](https://superteam.fun/earn/listing/meteora-dbc) includes developer tooling. Five competitive USDC prizes total 20000: 10000, 5000, 3000, 1500 and 500. Current observed submissions: 23, not a fixed eventual total. Winner announcement is scheduled by the sponsor for 31 October 2026; no verified payment date or guaranteed payout is stated.

Judging covers integration depth, technical execution, originality, impact and traction. Mainnet with active users is a preference in the listing, not an explicit public requirement to execute a project-owned mainnet token launch. Independent mainnet inspection must not be presented as our launch activity or traction.

The [side-track FAQ](https://superteam.fun/earn/hackathon/crypto-worlds-fair/) says side tracks are separate and require their own submissions. The signed-in Meteora form requires a Yes/No response about official Colosseum submission and marks the two Colosseum URL fields optional. No explicit prior-main-entry mandate was found in these reviewed sources. Do not turn that observation into a sponsor guarantee for a standalone entry.

The [Colosseum FAQ](https://colosseum.com/hackathon) requires its own registration and describes additional founder/team/location, logo, 2–3 minute presentation, product demo and business context. Those are separate main-entry requirements. The 73-second technical demonstration does not complete a founder presentation. No main Colosseum entry has been created or submitted by this workflow.

The official main-event rules end at 12 October 2026 23:59 Pacific / **13 October 12:29 IST**. The live side-track countdown is consistent with that window, but its exact cutoff was not independently exposed as a timestamp. Recommendation: complete the side entry before 12 October rather than rely on the last minute. Only one team/project may be entered in the main event. India is absent from its excluded-country list; the entrant's age, sanctions/employment/conflict eligibility and legal representations remain personal facts to verify.

[Superteam terms](https://superteam.fun/earn/terms-of-use.pdf), effective 24 June 2026, make the sponsor responsible for payment arrangements and disclaim platform responsibility for sponsor nonpayment. Eligibility and locally applicable obligations remain the entrant's responsibility. The form shows no wallet/identity upload request at this step; later payout checks and tax duties cannot be marked complete.

New upfront spend: **0**. Real SOL spent: **0**. Received cash, awarded prize and contractually due amount: **0**. The listing shows no-credit hackathon submission. No outreach, fabricated users or additional spending was undertaken.

## Three strongest prize risks

1. **Demand and differentiation:** existing creation/receipt tools already explain economics. No verified builder demand or willingness to pay supports this narrower draft comparison.
2. **Integration depth:** production inspection and local writes are proven; project-owned public launches, swaps, actual DAMM migration, DLMM and partner embeds are not.
3. **Traction:** no verified active users, customer revenue or launch volume; the sponsor explicitly prefers live usage.

These are our assessment, not actual rejection reasons. No comparable DBC winning entry was verified; no numerical win estimate is supportable. Freeze product expansion. The remaining form review is a bounded administrative step, not justification for spending to manufacture traction.

## Entrant's final steps

Confirm whether this project was independently submitted on Colosseum: enter Yes with actual links if so, or No if not. Review personal eligibility and the truthful scope/terms attestation. The entrant must perform the final prize-entry action. Then verify the platform's success state/submission record and save that confirmation; until then, submission remains unconfirmed.
