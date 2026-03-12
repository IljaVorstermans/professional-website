'use client';

import { useState, useEffect, useRef } from 'react';
import { questions, dims, pillars, levels, recommendations, pillarDesc, type Accumulator } from './data';

// ── Helpers ───────────────────────────────────────────────────────────────────

function pillarColor(pct: number): string {
  if (pct >= 70) return '#22C55E';
  if (pct >= 40) return '#F59E0B';
  return '#EF4444';
}

function betterThanPct(score: number): number {
  const table: [number, number][] = [
    [0, 2], [10, 8], [20, 18], [30, 32], [40, 47],
    [50, 61], [60, 74], [70, 84], [80, 92], [90, 97], [100, 99],
  ];
  for (let i = 0; i < table.length - 1; i++) {
    if (score <= table[i + 1][0]) {
      const [x0, y0] = table[i];
      const [x1, y1] = table[i + 1];
      return Math.round(y0 + ((score - x0) / (x1 - x0)) * (y1 - y0));
    }
  }
  return 99;
}

function calcImprovementPct(
  qIdx: number,
  questionScores: number[],
  dimScores: Accumulator,
): number {
  const q = questions[qIdx];
  const actual = questionScores[qIdx];
  if (actual >= 3) return 0;
  const diff = 3 - actual;
  const total = dims.reduce((s, d) => s + dimScores[d].score, 0);
  const max   = dims.reduce((s, d) => s + dimScores[d].max,   0);
  if (max === 0) return 0;
  return Math.min(100, Math.round(((total + diff) / max) * 100)) - Math.round((total / max) * 100);
}

function calcPillarGains(
  qIdx: number,
  questionScores: number[],
  pillarScores: Accumulator,
): Record<string, number> {
  const q = questions[qIdx];
  const actual = questionScores[qIdx];
  if (actual >= 3) return {};
  const diff = 3 - actual;
  const gains: Record<string, number> = {};
  Object.entries(q.pillars).forEach(([p, w]) => {
    const ps = pillarScores[p];
    if (!ps || ps.max === 0) return;
    const before = Math.round((ps.score / ps.max) * 100);
    const after  = Math.round(((ps.score + w * diff) / ps.max) * 100);
    if (after > before) gains[p] = after - before;
  });
  return gains;
}

interface BigTechEntry { company: string; count: number }

function calcBigTech(qs: Set<number>[]): BigTechEntry[] {
  const c: Record<string, number> = {};
  const add = (name: string) => { c[name] = (c[name] || 0) + 1; };
  if (qs[0]?.has(0))  add('Meta');
  if (qs[1]?.has(0))  add('Google');
  if (qs[1]?.has(1))  add('Microsoft');
  if (qs[2]?.has(0))  add('Meta');
  if (qs[2]?.has(1))  add('Apple');
  if (qs[3]?.has(0))  add('Google');
  if (qs[3]?.has(1))  add('Apple');
  if (qs[4]?.has(0))  add('Google');
  if (qs[4]?.has(1))  add('Apple');
  if (qs[7]?.has(0))  add('Google');
  if (qs[7]?.has(1))  add('Apple');
  if (qs[8]?.has(0))  add('Google');
  if (qs[8]?.has(1))  add('Microsoft');
  if (qs[8]?.has(2))  add('Apple');
  if (qs[9]?.has(0))  add('Google');
  if (qs[9]?.has(1))  add('Apple');
  if (qs[10]?.has(0)) add('Google');
  if (qs[10]?.has(1)) add('Apple');
  if (qs[11]?.has(0)) add('Google');
  if (qs[11]?.has(1)) add('Apple');
  if (qs[13]?.has(0)) add('Google');
  if (qs[13]?.has(1)) add('Microsoft');
  if (qs[14]?.has(0)) add('Meta');
  if (qs[14]?.has(1)) add('ByteDance');
  if (qs[14]?.has(2)) add('Meta');
  if (qs[14]?.has(3)) add('Google');
  return Object.entries(c)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count);
}

const BADGES = [
  { id: 'signal',  label: 'Signal Convert',   check: (qs: Set<number>[]) => qs[0]?.has(2)  || qs[0]?.has(3)  },
  { id: 'proton',  label: 'Encrypted Inbox',  check: (qs: Set<number>[]) => qs[1]?.has(2)  || qs[1]?.has(3)  },
  { id: 'vault',   label: 'Vault Keeper',     check: (qs: Set<number>[]) => qs[5]?.has(2)  || qs[5]?.has(3)  },
  { id: 'cookie',  label: 'Cookie Slayer',    check: (qs: Set<number>[]) => qs[15]?.has(3)                   },
  { id: 'maps',    label: 'Off the Map',      check: (qs: Set<number>[]) => qs[10]?.has(2) || qs[10]?.has(3) },
  { id: 'social',  label: 'Social Minimalist',check: (qs: Set<number>[]) => qs[14]?.has(6)                   },
  { id: 'linux',   label: 'Linux User',       check: (qs: Set<number>[]) => qs[8]?.has(3)                    },
  { id: 'browser', label: 'Privacy Browser',  check: (qs: Set<number>[]) => qs[9]?.has(2)  || qs[9]?.has(3)  },
] as const;

const EFFORT = ['', 'Low effort', 'Some effort', 'Significant effort'];
const FILL_MAX_MS = 2160;
const FILL_MIN_MS = 720;

const BIG_TECH_IMPLICATION: Record<string, string> = {
  Google:    'Combines your searches, location, emails, and browsing into a single profile used for ad targeting.',
  Meta:      'Tracks you across millions of websites using their pixel, even on sites you never post on.',
  Apple:     'Your photos, messages, and files are stored on US servers and subject to US law.',
  Microsoft: 'Your emails and documents are processed on US infrastructure governed by US law.',
  ByteDance: 'TikTok collects extensive device data and is subject to Chinese national security laws.',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ResultScreen({
  dimScores,
  pillarScores,
  questionScores,
  questionSelections,
  onRetake,
}: {
  dimScores: Accumulator;
  pillarScores: Accumulator;
  questionScores: number[];
  questionSelections: Set<number>[];
  onRetake: () => void;
}) {
  const total  = dims.reduce((s, d) => s + dimScores[d].score, 0);
  const maxTot = dims.reduce((s, d) => s + dimScores[d].max,   0);
  const pct    = Math.round((total / maxTot) * 100);
  const level  = levels.find(l => pct <= l.max)!;

  // Precompute
  const pillarPctValues = Object.fromEntries(
    pillars.map(p => [p, pillarScores[p].max ? Math.round((pillarScores[p].score / pillarScores[p].max) * 100) : 0])
  );
  const weakestPillar = pillars.reduce((a, b) => pillarPctValues[a] <= pillarPctValues[b] ? a : b);
  const betterThan    = betterThanPct(pct);
  const bigTech       = calcBigTech(questionSelections);
  const earnedBadges  = BADGES.filter(b => b.check(questionSelections));
  const applicable    = recommendations.filter(r => {
    if (questionScores[r.questionIdx] >= r.to) return false;
    if (r.excludeIfSelected?.some(idx => questionSelections[r.questionIdx]?.has(idx))) return false;
    return true;
  });

  // Level progression
  const levelIdx     = levels.findIndex(l => pct <= l.max);
  const levelTargets = levels.map((lv, i) => {
    const prevMax = i === 0 ? 0 : levels[i - 1].max;
    if (pct >= lv.max) return 100;
    if (pct < prevMax) return 0;
    return Math.round(((pct - prevMax) / (lv.max - prevMax)) * 100);
  });
  const levelsToAnimate = levelTargets.map((f, i) => ({ i, f })).filter(x => x.f > 0);

  // Pillar filter
  const [copied, setCopied] = useState(false);
  const [pillarFilter, setPillarFilter] = useState<string | null>(null);
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const filterablePillars = pillars.filter(p =>
    applicable.some(r => Object.keys(questions[r.questionIdx].pillars).includes(p))
  );
  const filteredRecs = pillarFilter
    ? applicable.filter(r => Object.keys(questions[r.questionIdx].pillars).includes(pillarFilter))
    : applicable;

  // Main reveal animation
  const [step, setStep]             = useState(0);
  const [displayPct, setDisplayPct] = useState(0);
  const [barWidth, setBarWidth]     = useState(0);
  const [pillarPcts, setPillarPcts] = useState<Record<string, number>>(
    Object.fromEntries(pillars.map(p => [p, 0]))
  );
  const ringRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Level-up overlay
  const [ovShowing, setOvShowing]               = useState(false);
  const [ovCurrentRank, setOvCurrentRank]       = useState(0);
  const [ovRevealedBars, setOvRevealedBars]     = useState<number[]>([]);
  const [ovBarFills, setOvBarFills]             = useState<Record<number, number>>({});
  const [ovBarTransitions, setOvBarTransitions] = useState<Record<number, number>>({});
  const [ovTextVisible, setOvTextVisible]       = useState(false);
  const [ovButtonLabel, setOvButtonLabel]       = useState<string | null>(null);
  const ovNextCallback = useRef<(() => void) | null>(null);
  const ovAbortRef     = useRef(false);

  function handleShare() {
    const text = `I scored ${pct}% on the Digital Autonomy Quiz - "${level.title}". How does your Big Tech relationship compare?`;
    const url  = typeof window !== 'undefined' ? `${window.location.origin}/quiz` : 'https://iljavorstermans.eu/quiz';
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'Digital Autonomy Quiz', text, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }

  function triggerNextSteps() {
    // Step 1: score counter + bar
    setStep(1);
    setTimeout(() => setBarWidth(pct), 120);
    const startTime = performance.now();
    const animatePct = (now: number) => {
      const t = Math.min((now - startTime) / 1200, 1);
      setDisplayPct(Math.round((1 - Math.pow(1 - t, 3)) * pct));
      if (t < 1) requestAnimationFrame(animatePct);
    };
    requestAnimationFrame(animatePct);
    // Step 2: level title + progression stack
    setTimeout(() => setStep(2), 1300);
    // Step 3: summary cards + badges
    setTimeout(() => setStep(3), 1800);
    // Step 4: pillar donuts
    setTimeout(() => {
      setStep(4);
      const computed = Object.fromEntries(pillars.map(p => [p, pillarPctValues[p]]));
      setPillarPcts(computed);
      pillars.forEach((p, idx) => {
        setTimeout(() => {
          const el = ringRefs.current[p];
          if (el) el.style.setProperty('--pct', String(computed[p]));
        }, idx * 160);
      });
    }, 2800);
    // Step 5: topic breakdown + Big Tech
    setTimeout(() => setStep(5), 4000);
    // Step 6: recommendations + share
    setTimeout(() => setStep(6), 4300);
  }

  function closeOverlay() {
    ovAbortRef.current = true;
    setOvShowing(false);
    setTimeout(triggerNextSteps, 300);
  }

  function animateLevel(rank: number) {
    if (ovAbortRef.current) return;
    const { i: lvIdx, f: targetPct } = levelsToAnimate[rank];
    const fillMs = Math.max(FILL_MIN_MS, Math.round((targetPct / 100) * FILL_MAX_MS));
    const isLast = rank === levelsToAnimate.length - 1;

    setOvCurrentRank(rank);
    setOvTextVisible(false);
    setOvButtonLabel(null);

    // Add this bar to the stack, starting at 0 width (guard against Strict Mode double-invoke)
    setOvRevealedBars(prev => prev.includes(rank) ? prev : [...prev, rank]);
    setOvBarFills(prev => ({ ...prev, [rank]: 0 }));
    setOvBarTransitions(prev => ({ ...prev, [rank]: 0 }));

    setTimeout(() => {
      if (ovAbortRef.current) return;
      setOvTextVisible(true);

      setTimeout(() => {
        if (ovAbortRef.current) return;
        // Animate this bar filling up
        setOvBarTransitions(prev => ({ ...prev, [rank]: fillMs }));
        setOvBarFills(prev => ({ ...prev, [rank]: targetPct }));

        setTimeout(() => {
          if (ovAbortRef.current) return;
          if (isLast) {
            ovNextCallback.current = closeOverlay;
            setOvButtonLabel('See my results →');
          } else {
            ovNextCallback.current = () => {
              setOvButtonLabel(null);
              setOvTextVisible(false);
              setTimeout(() => animateLevel(rank + 1), 300);
            };
            setOvButtonLabel('Next →');
          }
        }, fillMs + 300);
      }, 350);
    }, 100);
  }

  useEffect(() => {
    if (!activePillar) return;
    const close = () => setActivePillar(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [activePillar]);

  useEffect(() => {
    // Launch overlay immediately - score reveal happens after overlay is dismissed
    ovAbortRef.current = false;
    setOvShowing(true);
    animateLevel(0);
    return () => {
      ovAbortRef.current = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const reveal = (minStep: number): React.CSSProperties => ({
    opacity:       step >= minStep ? 1 : 0,
    transform:     step >= minStep ? 'translateY(0)' : 'translateY(14px)',
    transition:    'opacity 0.5s ease, transform 0.5s ease',
    pointerEvents: step >= minStep ? 'auto' : 'none',
  });

  return (
    <>
      {/* ── Level-up overlay ── */}
      {ovShowing && (
        <div className="lv-overlay">
          <div className="lv-panel">

            {/* Title and description - fades with each level */}
            <div className={`lv-content${ovTextVisible ? ' lv-content--visible' : ''}`}>
              <div className="lv-counter">
                Level {(levelsToAnimate[ovCurrentRank]?.i ?? 0) + 1} of {levels.length}
              </div>
              <div className="lv-title">
                {levels[levelsToAnimate[ovCurrentRank]?.i ?? 0]?.title}
              </div>
              <div className="lv-desc">
                {levels[levelsToAnimate[ovCurrentRank]?.i ?? 0]?.desc}
              </div>
            </div>

            {/* Stacked progress bars - one per level, accumulating */}
            {ovRevealedBars.length > 0 && (
              <div className="lv-bars-stack">
                {ovRevealedBars.map(rank => (
                  <div key={rank} className="lv-bar-row">
                    <span className="lv-bar-label">
                      {levels[levelsToAnimate[rank].i].title}
                    </span>
                    <div className="lv-bar-track">
                      <div
                        className="lv-bar-fill"
                        style={{
                          width: (ovBarFills[rank] ?? 0) + '%',
                          transition: (ovBarTransitions[rank] ?? 0) > 0
                            ? `width ${ovBarTransitions[rank]}ms linear`
                            : 'none',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Button */}
            <div className="lv-ok-row" style={{ visibility: ovButtonLabel ? 'visible' : 'hidden' }}>
              <button className="lv-ok-btn" onClick={() => ovNextCallback.current?.()}>
                {ovButtonLabel ?? 'Next →'}
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="progress-bar" style={{ width: '100%' }} />
      <div className="screen" style={ovShowing ? { filter: 'blur(8px)', opacity: 0.4, transition: 'filter 0.3s, opacity 0.3s', pointerEvents: 'none' } : { filter: 'none', opacity: 1, transition: 'filter 0.4s, opacity 0.4s' }}>

        {/* ── Step 1: Score counter + bar ── */}
        <div style={reveal(1)}>
          <div className="result-label">Your relationship status</div>
          <div className="result-score-counter">{displayPct}%</div>
          <div className="result-score-sub">digital autonomy</div>
          <div className="score-bar-bg">
            <div className="score-bar-fill" style={{ width: barWidth + '%' }} />
          </div>
        </div>

        {/* ── Step 2: Level title + description + progression stack ── */}
        <div style={reveal(2)}>
          <div className="result-title">{level.title}</div>
          <div className="result-desc">{level.desc}</div>
          <div className="level-stack">
            {levels.map((lv, i) => {
              const status = i < levelIdx ? 'done' : i === levelIdx ? 'current' : 'future';
              const title  = i <= levelIdx ? lv.title : '• • • • •';
              return (
                <div key={lv.title} className={`level-row level-row--${status}`}>
                  <span className="level-row-title">{title}</span>
                  <div className="level-bar-track">
                    <div className="level-bar-fill" style={{ width: levelTargets[i] + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Step 3: Summary cards + badges ── */}
        <div style={reveal(3)}>
          <div className="summary-row">
            <div className="summary-card">
              <div className="summary-value">{betterThan}%</div>
              <div className="summary-label">better than others who&apos;ve taken this quiz</div>
            </div>
            <div className="summary-card summary-card--weak">
              <div className="summary-card-header">Weakest area</div>
              <div className="summary-value">{weakestPillar}</div>
              <div className="summary-label">{pillarPctValues[weakestPillar]}% score</div>
            </div>
          </div>

          {earnedBadges.length > 0 && (
            <div className="badges-section">
              <div className="badges-label">Achievements unlocked</div>
              <div className="badges-row">
                {earnedBadges.map(b => (
                  <span key={b.id} className="badge">{b.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Step 4: Pillar donuts (staggered) ── */}
        <div style={reveal(4)}>
          <div className="pillar-donuts">
            {pillars.map(p => {
              const pp    = pillarPcts[p] ?? 0;
              const color = pillarColor(pp);
              return (
                <div key={p} className="pillar-donut">
                  <div
                    className="pillar-ring"
                    ref={el => { ringRefs.current[p] = el; }}
                    style={{ '--pct': 0, '--ring-color': color } as React.CSSProperties}
                  >
                    <span className="pillar-pct" style={{ color }}>{pp}%</span>
                  </div>
                  <button
                    className="pillar-label"
                    onClick={e => { e.stopPropagation(); setActivePillar(activePillar === p ? null : p); }}
                    aria-label={`What is ${p}?`}
                  >{p}</button>
                  {activePillar === p && (
                    <div className="pillar-tooltip" onClick={e => e.stopPropagation()}>
                      {pillarDesc[p]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Step 5: Topic breakdown + Big Tech footprint ── */}
        <div style={reveal(5)}>
          <div className="breakdown">
            {dims.map(d => {
              const dp = dimScores[d].max ? Math.round((dimScores[d].score / dimScores[d].max) * 100) : 0;
              return (
                <div key={d} className="breakdown-row">
                  <span className="breakdown-dim">{d}</span>
                  <div className="breakdown-bar-col">
                    <div className="breakdown-track">
                      <div className="breakdown-fill" style={{ width: dp + '%' }} />
                    </div>
                  </div>
                  <span className="breakdown-pct">{dp}%</span>
                </div>
              );
            })}
          </div>

          {bigTech.length > 0 && (
            <div className="footprint-card">
              <div className="footprint-title">Your Big Tech footprint</div>
              <div className="footprint-items">
                {bigTech.slice(0, 4).map(({ company, count }) => (
                  <div key={company} className="footprint-item-block">
                    <div className="footprint-item">
                      <span className="footprint-company">{company}</span>
                      <span className="footprint-count">{count} {count === 1 ? 'touchpoint' : 'touchpoints'}</span>
                    </div>
                    {BIG_TECH_IMPLICATION[company] && (
                      <p className="footprint-implication">{BIG_TECH_IMPLICATION[company]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Step 6: Recommendations + email + retake ── */}
        <div style={reveal(6)}>
          <div className="recs-wrapper">
            {applicable.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                You&apos;ve already made the key moves. Impressive.
              </p>
            ) : (
              <>
                <div className="recs-header">
                  <div className="recs-label">Your next moves</div>
                  {filterablePillars.length > 1 && (
                    <div className="filter-pills">
                      <button
                        className={`filter-pill${!pillarFilter ? ' active' : ''}`}
                        onClick={() => setPillarFilter(null)}
                      >All</button>
                      {filterablePillars.map(p => (
                        <button
                          key={p}
                          className={`filter-pill${pillarFilter === p ? ' active' : ''}`}
                          onClick={() => setPillarFilter(pillarFilter === p ? null : p)}
                        >{p}</button>
                      ))}
                    </div>
                  )}
                </div>

                {filteredRecs.map(r => {
                  const improvement = calcImprovementPct(r.questionIdx, questionScores, dimScores);
                  const gains       = calcPillarGains(r.questionIdx, questionScores, pillarScores);
                  return (
                    <div key={r.id} className="rec-card">
                      <div className="rec-card-top">
                        <span className="rec-card-title">{r.title}</span>
                        <div className="rec-card-meta">
                          {improvement > 0 && <span className="rec-improvement">+{improvement}%</span>}
                          <span className="rec-effort">{EFFORT[r.effort]}</span>
                        </div>
                      </div>
                      <p className="rec-card-desc">{r.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                        <a className="rec-action" href={r.link} target="_blank" rel="noopener noreferrer">
                          {r.action} →
                        </a>
                        {r.sourceUrl && (
                          <a className="source-link" href={r.sourceUrl} target="_blank" rel="noopener noreferrer">
                            · Source: {r.sourceLabel}
                          </a>
                        )}
                      </div>
                      {Object.keys(gains).length > 0 && (
                        <div className="rec-pillars">
                          {Object.entries(gains).map(([p, g]) => (
                            <span key={p} className="rec-pillar-tag">{p} +{g}%</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="email-box">
            <div className="email-box-title">Get your personalised roadmap</div>
            <div className="email-box-sub">We&apos;ll send you specific next steps based on your answers.</div>
            <div className="email-row">
              <input className="email-input" type="email" placeholder="your@email.com" />
              <button className="btn-send">Send it</button>
            </div>
          </div>

          <div className="share-row">
            <button className="btn-share" onClick={handleShare}>
              {copied ? 'Link copied!' : 'Share your result →'}
            </button>
            <span className="share-hint">Challenge a friend to compare</span>
          </div>

          <div className="retake-row">
            <span className="retake-hint">Made a change? Come back and see how much you&apos;ve improved.</span>
            <button className="btn-retake" onClick={onRetake}>Retake →</button>
          </div>
        </div>

      </div>
    </>
  );
}
