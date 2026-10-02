# CurveReceipt — focused demo plan

The paced browser demonstration has passed in CI with live mainnet reads and no mocked RPC data. The exported English-captioned video is served at `/demo.mp4`; production-bundle recording provenance and source run are in `docs/proof/demo-provenance.json`. The browser serves the built bundle locally in CI, rather than recording the hosted production transport.

## One builder task

"Before linking a token launch, check whether its configured fees and liquidity allocations match the selected terms in my draft."

## Recording contents

1. Open the Design view. Show the default 2 SOL threshold, zero graduation fee and 100% creator permanently locked LP. Explain that the official DBC builder computes a valid configuration, while this view creates no transaction.
2. Use the live-example comparison. This mainnet configuration belongs to an independent existing launch, not CurveReceipt. The recorded config has 11/24 matches with the default draft. The threshold differs: 2 SOL planned versus 88.859501705 SOL on chain. Creator graduation share and permanent LP allocation are separate comparisons.
3. Inspect the total graduation fee and its creator/partner shares. Explain that the same headline fee can pay different recipients. Show fee timing, first-buyer discount, dynamic-fee flags and LP rights where the actual account has relevant values.
4. Show the source config, Explorer link and selected network. Share the receipt URL and verify that a fresh tab reads the intended account. The URL does not carry or authenticate the local draft.
5. The demonstration identifies the separate local-program proof; it does not depict those transactions as mainnet creation. The public proof logs contain the official fixture, temporary local test SOL, confirmed config/pool transactions and production readback. No swap or completed DAMM migration is claimed.
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
