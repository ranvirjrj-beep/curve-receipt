import { useEffect, useMemo, useState } from 'react';
import { inspect, type Network } from './chain';
import { buildConfig, DEFAULT_DESIGN, launchDevnetDemo, type Design, validateDesign } from './studio';
import { formatUnits, type LaunchTerms } from './terms';
import { comparePlan } from './compare';

const EXAMPLE = '69xxfUPhKAUBFHhsjGMKdoCp9iordjvWktvdJRHAbz3y';
const short = (value: string) => `${value.slice(0, 5)}…${value.slice(-5)}`;
const pct = (bps: number) => `${(bps / 100).toLocaleString('en-US', { maximumFractionDigits: 3 })}%`;
const explorer = (address: string, network: Network) => `https://explorer.solana.com/address/${encodeURIComponent(address)}?cluster=${network === 'devnet' ? 'devnet' : 'mainnet-beta'}`;
const txLink = (signature: string) => `https://explorer.solana.com/tx/${encodeURIComponent(signature)}?cluster=devnet`;

type Result = { terms: LaunchTerms; slot: number; network: Network };

function Row({ name, value, mono = false, sub }: { name: string; value: string | number; mono?: boolean; sub?: string }) {
  return <div className="term-row"><div><span className="term-name">{name}</span>{sub && <small>{sub}</small>}</div><strong className={mono ? 'mono' : ''}>{value}</strong></div>;
}

function Address({ label, value, network }: { label: string; value: string; network: Network }) {
  return <div className="address-row"><span>{label}</span><a title={value} href={explorer(value, network)} target="_blank" rel="noreferrer">{short(value)} <span aria-hidden="true">↗</span></a></div>;
}

function Field({ label, value, min, max, step = '1', unit, onChange, help }: {
  label: string; value: number; min: number; max: number; step?: string; unit: string; onChange: (n: number) => void; help?: string;
}) {
  return <label className="field"><span className="field-label">{label}{help && <small>{help}</small>}</span><span className="number-wrap"><input type="number" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /><span>{unit}</span></span></label>;
}

export default function App() {
  const [page, setPage] = useState<'verify' | 'design'>('verify');
  const [address, setAddress] = useState(new URLSearchParams(location.search).get('address') || '');
  const [network, setNetwork] = useState<Network>(new URLSearchParams(location.search).get('network') === 'devnet' ? 'devnet' : 'mainnet');
  const [rpc, setRpc] = useState('');
  const [showRpc, setShowRpc] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [design, setDesign] = useState<Design>({ ...DEFAULT_DESIGN });
  const [planned, setPlanned] = useState<Design | null>(null);
  const [demoStep, setDemoStep] = useState('');
  const [demoWorking, setDemoWorking] = useState(false);
  const [demo, setDemo] = useState<{ config: string; pool: string; mint: string; configSignature: string; poolSignature: string } | null>(null);

  const designErrors = useMemo(() => validateDesign(design), [design]);
  const model = useMemo(() => {
    if (designErrors.length) return { preview: null, error: '' };
    try {
      const built = buildConfig(design);
      return { preview: {
        threshold: formatUnits(built.migrationQuoteThreshold.toString(), 9),
        segments: built.curve.filter(point => !point.liquidity.isZero()).length,
        migrationTargetShare: design.migrationSupplyPercent,
      }, error: '' };
    } catch (e) { return { preview: null, error: e instanceof Error ? e.message : 'These settings cannot form a DBC curve.' }; }
  }, [design, designErrors]);
  const sdkPreview = model.preview;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requested = params.get('address');
    if (requested) void handleInspect(requested, params.get('network') === 'devnet' ? 'devnet' : 'mainnet');
    // The shared link is loaded once; subsequent edits use the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleInspect(nextAddress = address, nextNetwork = network, nextRpc = rpc) {
    setWorking(true); setError(''); setResult(null); setCopied(false);
    try {
      const read = await inspect(nextAddress, nextNetwork, nextRpc);
      setResult({ ...read, network: nextNetwork });
      setNetwork(nextNetwork); setAddress(nextAddress);
      history.replaceState(null, '', `?address=${encodeURIComponent(nextAddress.trim())}&network=${nextNetwork}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this account. Check network and RPC.');
    } finally { setWorking(false); }
  }

  async function copyReceipt() {
    await navigator.clipboard.writeText(location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  async function runDemo() {
    setDemo(null); setDemoWorking(true); setDemoStep('Preparing official SDK curve…');
    try {
      const proof = await launchDevnetDemo(design, setDemoStep, network === 'devnet' ? rpc : undefined);
      setPlanned({ ...design });
      setDemo(proof);
      setDemoStep('Both accounts verified against the devnet DBC program.');
      setAddress(proof.pool);
      setNetwork('devnet');
    } catch (e) {
      setDemoStep(e instanceof Error ? e.message : 'Devnet launch failed. Try another RPC or the faucet later.');
    } finally { setDemoWorking(false); }
  }

  const update = (key: keyof Design) => (value: number) => setDesign(current => ({ ...current, [key]: value }));
  const current = result?.terms;
  const comparison = current && planned ? comparePlan(planned, current) : null;
  return <div className="app">
    <header className="topbar"><div className="shell topbar-inner"><a className="wordmark" href="/" aria-label="CurveReceipt home"><span className="mark"><span /></span><span>curve<span className="wordmark-light">receipt</span></span></a><span className="top-note">Meteora DBC launch terms, directly from the account</span><a className="docs-link" href="https://docs.meteora.ag/core-products/dbc/what-is-dbc" target="_blank" rel="noreferrer">DBC docs <span aria-hidden="true">↗</span></a></div></header>

    <main className="shell main">
      <div className="intro"><div><div className="eyebrow"><span className="eyebrow-line" /> OPEN LAUNCH INTELLIGENCE</div><h1>Know the terms<br /><em>before the trade.</em></h1><p>Inspect the exact fees, migration take, LP allocation and control addresses behind a Meteora DBC launch. Model a new curve, then verify what landed on-chain.</p></div><div className="intro-aside"><span className="orb" aria-hidden="true"><span /></span><div><b>01 / 02</b><span>Design terms → verify account</span></div></div></div>

      <nav className="tabs" aria-label="Product views"><button className={page === 'verify' ? 'active' : ''} onClick={() => setPage('verify')} type="button"><span>01</span> Verify a launch</button><button className={page === 'design' ? 'active' : ''} onClick={() => setPage('design')} type="button"><span>02</span> Design a launch</button></nav>

      {page === 'verify' ? <div className="workspace"><section className="panel inspect-panel"><div className="section-heading"><div><div className="overline">ACCOUNT LOOKUP</div><h2>Read the source of truth</h2></div><span className="live-tag">ON-CHAIN READ</span></div><p className="secondary">Paste a DBC config or virtual pool address. The official SDK decodes the live Solana account; the receipt links every term back to it.</p><form onSubmit={e => { e.preventDefault(); void handleInspect(); }} className="inspect-form"><label htmlFor="address">CONFIG OR POOL ADDRESS</label><div className="input-group"><input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Paste a Solana address" spellCheck="false" autoComplete="off" /><select aria-label="Network" value={network} onChange={e => setNetwork(e.target.value as Network)}><option value="mainnet">Mainnet</option><option value="devnet">Devnet</option></select></div><button className="primary-button" disabled={working} type="submit">{working ? 'Reading account…' : 'Inspect launch terms'} <span aria-hidden="true">↗</span></button></form><div className="example-line">Try a live mainnet config <button type="button" onClick={() => { setAddress(EXAMPLE); setNetwork('mainnet'); setRpc(''); void handleInspect(EXAMPLE, 'mainnet', ''); }}>{short(EXAMPLE)}</button></div><button type="button" className="rpc-toggle" onClick={() => setShowRpc(!showRpc)}>{showRpc ? 'Hide' : 'Use a different'} HTTPS RPC</button>{showRpc && <label className="rpc-field">Optional RPC URL<input value={rpc} onChange={e => setRpc(e.target.value)} placeholder="https://your-solana-rpc.example" /></label>}{error && <div className="error" role="alert">{error}<small>Public RPC endpoints can be busy. Check the network or enter another HTTPS RPC endpoint.</small></div>}</section>

      {!current && <aside className="blank-panel"><div className="blank-symbol" aria-hidden="true">⌁</div><div className="overline">THE RECEIPT</div><h2>No account loaded yet.</h2><p>Read a real launch to see the terms that matter at graduation: who gets the quote assets, how much liquidity can move, and who controls future changes.</p><div className="blank-bars" aria-hidden="true"><i /><i /><i /></div></aside>}

      {current && <section className="receipt" aria-live="polite"><div className="receipt-head"><div><span className="overline">DBC ACCOUNT READ · {result!.network.toUpperCase()} · HEAD SLOT {result!.slot.toLocaleString()}</span><h2>Launch receipt</h2><span className="receipt-address">{short(current.address)}</span></div><button type="button" className="copy-button" onClick={() => void copyReceipt()}>{copied ? 'Link copied' : 'Share this receipt'}</button></div>
        {current.pool && <div className="pool-progress"><div><span>CURVE PROGRESS</span><strong>{current.pool.progress}%</strong></div><div className="progress-track"><i style={{ width: `${current.pool.progress}%` }} /></div><p>{current.pool.state} · {current.pool.quoteReserve} / {current.quoteThreshold} {current.quoteSymbol} in reserve</p></div>}
        <div className="receipt-content"><div className="receipt-section"><h3>Trade economics</h3><Row name="Quote asset" value={current.quoteSymbol} /><Row name="Pre-migration supply" value={`${current.supply} · ${current.tokenType}`} /><Row name="Bonding curve fee" value={current.feeMode === 'Legacy rate limiter' ? 'Variable (rate limiter)' : current.feePeriod === 'Fixed' ? pct(current.startFeeBps) : `${pct(current.startFeeBps)} → ${pct(current.endFeeBps)}`} sub={current.feePeriod} /><Row name="First swap at minimum fee" value={current.firstSwapAtMinimum ? 'Yes' : 'No'} /><Row name="Dynamic fee" value={current.dynamicFee ? 'Enabled' : 'Off'} /><Row name="Creator share of trading fees" value={`${current.creatorTradingShare}%`} sub="Share of the partner/creator portion, after protocol fee" /><Row name="Pool creation fee" value={`${current.poolCreationFee} SOL`} /></div>
          <div className="receipt-section"><h3>Graduation</h3><Row name="Quote threshold" value={`${current.quoteThreshold} ${current.quoteSymbol}`} /><Row name="Migration fee" value={`${current.migrationFee}% · ${current.migrationFeeAmount} ${current.quoteSymbol}`} /><Row name="Creator migration fee" value={`${current.creatorMigrationAmount} ${current.quoteSymbol}`} /><Row name="Partner migration fee" value={`${current.partnerMigrationAmount} ${current.quoteSymbol}`} /><Row name="Destination" value={current.migrationTarget} /><Row name="DAMM trading fee" value={current.migratedPoolFee} /></div>
          <div className="receipt-section"><h3>Liquidity & control</h3><div className="lp-track" title="Partner / creator non-permanent and permanently locked LP"><i style={{ width: `${current.partnerUnlockedLP}%` }} /><i style={{ width: `${current.creatorUnlockedLP}%` }} /><i style={{ width: `${current.partnerLockedLP}%` }} /><i style={{ width: `${current.creatorLockedLP}%` }} /></div><div className="lp-key"><span>Partner non-permanent {current.partnerUnlockedLP}%</span><span>Creator non-permanent {current.creatorUnlockedLP}%</span><span>Partner locked {current.partnerLockedLP}%</span><span>Creator locked {current.creatorLockedLP}%</span></div><Row name="Vesting of non-permanent LP" value={`Partner ${current.partnerVesting}% · Creator ${current.creatorVesting}%`} /><Row name="Token authority" value={current.tokenAuthority} /><Row name="Curve segments" value={current.curveSegments} /></div>
          <div className="receipt-section"><h3>Source accounts</h3><Address label="DBC config" value={current.address} network={result!.network} /><Address label="Fee claimer" value={current.feeClaimer} network={result!.network} /><Address label="Leftover receiver" value={current.leftoverReceiver} network={result!.network} />{current.pool && <><Address label="Virtual pool" value={current.pool.address} network={result!.network} /><Address label="Pool creator" value={current.pool.creator} network={result!.network} /><Address label="Base mint" value={current.pool.baseMint} network={result!.network} /></>}<p className="receipt-note">RPC head slot after the account reads: {result!.slot.toLocaleString()}. This describes launch terms, not the honesty or future actions of any person behind a token.</p></div></div>
        <div className="findings"><h3>Terms to notice <span>{current.findings.length}</span></h3>{current.findings.length ? current.findings.map((finding, i) => <div className={`finding ${finding.tone}`} key={`${finding.title}-${i}`}><span aria-hidden="true">{finding.tone === 'caution' ? '!' : 'i'}</span><div><strong>{finding.title}</strong><p>{finding.detail}</p></div></div>) : <p className="quiet">No flagged terms in this account. Review the full receipt and addresses above.</p>}</div>
        {comparison && <div className="comparison"><div className="comparison-title"><div><div className="overline">DRAFT VS CHAIN</div><h3>{comparison.filter(x => x.matches).length}/{comparison.length} planned terms match</h3></div><button type="button" onClick={() => setPlanned(null)}>Clear draft</button></div><p>Your local draft is editable and is not a signed commitment. This check compares its values with the live account; it does not prove who made either.</p><div className="comparison-grid"><span>PARAMETER</span><span>LOCAL DRAFT</span><span>ON CHAIN</span></div>{comparison.map(row => <div className={`comparison-grid comparison-row ${row.matches ? 'match' : 'mismatch'}`} key={row.name}><b>{row.name}</b><span>{row.planned}</span><strong>{row.onchain} <i>{row.matches ? '✓' : '!'}</i></strong></div>)}</div>}
        {demo && result!.network === 'devnet' && (current.address === demo.config || current.pool?.address === demo.pool) && <div className="demo-receipt-links"><b>Demo transactions</b><a href={txLink(demo.configSignature)} target="_blank" rel="noreferrer">Config transaction ↗</a><a href={txLink(demo.poolSignature)} target="_blank" rel="noreferrer">Pool transaction ↗</a></div>}</section>}
      </div> : <div className="design-layout"><section className="panel design-panel"><div className="section-heading"><div><div className="overline">CURVE STUDIO</div><h2>Set the terms up front</h2></div><span className="live-tag devnet">SDK MODEL</span></div><p className="secondary">A transparent SOL-quoted, fixed-supply DBC template. The official Meteora SDK computes the curve and graduation amounts. Edit the economics before a launch exists.</p><div className="fields"><Field label="Graduation threshold" value={design.threshold} min={0.1} max={1000} step="0.1" unit="SOL" onChange={update('threshold')} help="Quote assets required to complete the curve" /><Field label="Token supply" value={design.supply} min={100000} max={1000000000000} unit="tokens" onChange={update('supply')} /><Field label="Supply target for migration" value={design.migrationSupplyPercent} min={1} max={90} unit="%" onChange={update('migrationSupplyPercent')} /><Field label="Opening fee" value={design.startFeeBps} min={25} max={9900} unit="bps" onChange={update('startFeeBps')} /><Field label="Ending fee" value={design.endFeeBps} min={25} max={9900} unit="bps" onChange={update('endFeeBps')} /><Field label="Fee reduction duration" value={design.feeDurationSeconds} min={0} max={604800} step="10" unit="seconds" onChange={update('feeDurationSeconds')} /><Field label="Creator non-permanent LP" value={design.creatorUnlockedLP} min={0} max={90} unit="%" onChange={update('creatorUnlockedLP')} help="The rest stays permanently locked" /><Field label="Graduation fee to creator" value={design.migrationFeePercent} min={0} max={99} unit="%" onChange={update('migrationFeePercent')} /></div><div className="locked-assumptions"><b>Fixed by this template</b><span>Immutable metadata · no first-buyer fee discount · DAMM v2 · 0.25% migrated pool fee · creator receives trading fee share</span></div>{designErrors.length > 0 && <div className="error" role="alert">{designErrors.join(' ')}</div>}{model.error && <div className="error" role="alert">Meteora SDK: {model.error}</div>}<button type="button" className="compare-plan-button" disabled={!sdkPreview} onClick={() => { setPlanned({ ...design }); setPage('verify'); }}>Save this draft for account comparison ↗</button><p className="plan-note">Saved in this open tab only. You can inspect any DBC address and see every matching or changed term.</p><button type="button" className="compare-plan-button" disabled={!sdkPreview} onClick={() => { setPlanned({ ...design }); setPage('verify'); setRpc(''); void handleInspect(EXAMPLE, 'mainnet', ''); }}>Compare with a live mainnet example ↗</button><p className="plan-note">This existing launch is independent of your draft. A match shows shared settings, not a promise from its creator.</p></section>

      <section className="design-preview"><div className="preview-header"><span className="overline">LIVE MODEL</span><h2>{sdkPreview ? 'A curve you can account for.' : 'Check these settings.'}</h2><p>Computed from the input given to Meteora's official builder. No wallet or transaction is needed to model.</p></div>{sdkPreview && <><div className="big-metric"><span>GRADUATION TARGET</span><strong>{sdkPreview.threshold}<small> SOL</small></strong><p>{sdkPreview.segments} curve segment{sdkPreview.segments === 1 ? '' : 's'} · {sdkPreview.migrationTargetShare}% target supply share for migration</p></div><div className="split-grid"><div><span>GRADUATION FEE</span><b>{design.migrationFeePercent}%</b><small>{(design.threshold * design.migrationFeePercent / 100).toLocaleString('en-US', { maximumFractionDigits: 5 })} SOL at the threshold</small></div><div><span>PERMANENT LP LOCK</span><b>{100 - design.creatorUnlockedLP}%</b><small>{design.creatorUnlockedLP}% non-permanent creator allocation</small></div></div><div className="fee-rail"><span>OPENING {pct(design.startFeeBps)}</span><span>ENDING {pct(design.endFeeBps)}</span><i /></div></>}
        <div className="demo-box"><div className="overline">OPTIONAL DEVNET EXPERIMENT</div><h3>Test a new launch on devnet</h3><p>This requests free devnet SOL for an in-tab temporary wallet before creating a config and pool. The shared faucet has repeatedly returned errors; use the live mainnet receipt above for the reliable no-faucet judge flow.</p><button className="primary-button" disabled={!sdkPreview || demoWorking} onClick={() => void runDemo()} type="button">{demoWorking ? 'Creating on devnet…' : 'Create & verify demo launch'} <span aria-hidden="true">↗</span></button>{demoStep && <div className={`demo-status ${demo && !demoWorking ? 'success' : ''}`} role="status">{demoStep}</div>}{demo && <div className="proof-links"><a href={explorer(demo.config, 'devnet')} target="_blank" rel="noreferrer">Config account ↗</a><a href={explorer(demo.pool, 'devnet')} target="_blank" rel="noreferrer">DBC pool ↗</a><a href={txLink(demo.configSignature)} target="_blank" rel="noreferrer">Config transaction ↗</a><a href={txLink(demo.poolSignature)} target="_blank" rel="noreferrer">Pool transaction ↗</a><button type="button" onClick={() => {setPage('verify'); void handleInspect(demo.pool, 'devnet');}}>Inspect this pool</button></div>}</div>
      </section></div>}
    </main><footer className="shell footer"><span>CURVERECEIPT / OPEN-SOURCE PROTOTYPE</span><span>Powered by the <a href="https://github.com/MeteoraAg/dynamic-bonding-curve-sdk" target="_blank" rel="noreferrer">Meteora DBC SDK ↗</a></span><a href="https://github.com/ranvirjrj-beep/curve-receipt" target="_blank" rel="noreferrer">GitHub source · MIT ↗</a></footer>
  </div>;
}
