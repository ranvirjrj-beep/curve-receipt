# CurveReceipt — focused demo plan

This is a recording plan, not a completed video or browser test. Execute and verify each step before recording. Do not replace a failed network request with an undisclosed fixture.

## One builder task

"Before linking a token launch, check whether its configured fees and liquidity allocations match the selected terms in my draft."

## Suggested 90–120 second sequence

1. Open the Design view. Show the default 2 SOL threshold, zero graduation fee and 100% creator permanently locked LP. Explain that the official DBC builder computes a valid configuration, while this view creates no transaction.
2. Use the live-example comparison. This mainnet configuration belongs to an independent existing launch, not CurveReceipt. Confirm that the browser actually reads it before recording. Show one real match and one real difference; do not prescribe which values differ until the live result has been observed.
3. Inspect the total graduation fee and its creator/partner shares. Explain that the same headline fee can pay different recipients. Show fee timing, first-buyer discount, dynamic-fee flags and LP rights where the actual account has relevant values.
4. Show the source config, Explorer link and selected network. Share the receipt URL and verify that a fresh tab reads the intended account. The URL does not carry or authenticate the local draft.
5. Open the public local-validator proof run. Clearly label the environment: official Meteora program fixture, temporary local test SOL, confirmed config and pool transactions, and SDK readback. This is not devnet or mainnet launch proof, and it does not demonstrate DAMM migration.
6. Close with the exact limitation: "We compare 24 selected economic terms. The draft is editable and unsigned. This is a terms inspection tool, not an attestation of creator honesty or a complete curve audit."

## Pass conditions before recording

- The mainnet example loads in the actual browser without a wallet or paid RPC.
- Invalid address, missing account and RPC/network errors display useful messages.
- Draft comparison and clearing it work; changes to the design are reflected in a newly saved draft.
- Shared URL and Explorer links use the correct account/network; a fresh tab does not claim to retain the unsigned draft.
- Desktop and mobile views remain readable.
- All evidence links are accessible to a signed-out judge.
- No public devnet claim is included without a verified config/pool transaction.

If a core pass condition is blocked, keep the submission on hold. Screenshots, scripts and successful builds do not replace execution of this user journey.
