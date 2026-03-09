'use client';

import { useState, useEffect } from 'react';
import { questions, dims, pillars, type Question, type Accumulator } from './data';
import ResultScreen from './ResultScreen';

type Screen = 'landing' | 'question' | 'result';

function makeDimScores(): Accumulator {
  return Object.fromEntries(dims.map(d => [d, { score: 0, max: 0 }]));
}
function makePillarScores(): Accumulator {
  return Object.fromEntries(pillars.map(p => [p, { score: 0, max: 0 }]));
}

function recordScore(q: Question, s: number, dim: Accumulator, pil: Accumulator) {
  dim[q.dim].score += s;
  dim[q.dim].max   += 3;
  Object.entries(q.pillars).forEach(([p, w]) => { pil[p].score += w * s; pil[p].max += w * 3; });
}

function unrecordScore(q: Question, s: number, dim: Accumulator, pil: Accumulator) {
  dim[q.dim].score -= s;
  dim[q.dim].max   -= 3;
  Object.entries(q.pillars).forEach(([p, w]) => { pil[p].score -= w * s; pil[p].max -= w * 3; });
}

// ── Landing ───────────────────────────────────────────────────────────────────

function LandingScreen({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  return (
    <div className="screen">
      <div className="label">Digital Autonomy Quiz</div>
      <h1 className="landing-title">How&apos;s your relationship with Big Tech?</h1>
      <div className="level-chips">
        {['In Denial', "It's Complicated", "It's not me, it's you!", 'Seeing Someone Else', 'New Love'].map(l => (
          <span key={l} className="level-chip">{l}</span>
        ))}
      </div>
      <p className="landing-sub">
        Find out if you&apos;re in denial or close to finding new love in under two minutes. No account required.
      </p>
      <button className="btn-primary" onClick={onStart}>Find out →</button>
      {process.env.NODE_ENV === 'development' && (
        <button className="btn-demo" onClick={onDemo}>Skip to result (random) →</button>
      )}
    </div>
  );
}

// ── Question ──────────────────────────────────────────────────────────────────

function QuestionScreen({
  current, selectedIndices, disabled,
  onToggleMulti, onPickSingle, onContinue, onBack,
}: {
  current: number; selectedIndices: Set<number>; disabled: boolean;
  onToggleMulti: (i: number) => void; onPickSingle: (i: number) => void;
  onContinue: () => void; onBack: () => void;
}) {
  const q           = questions[current];
  const progressPct = (current / questions.length) * 100;
  const showContinue = q.multi && selectedIndices.size > 0;
  const hint = q.hint
    ? (q.multi ? q.hint + ', select all that apply' : q.hint)
    : (q.multi ? 'Select all that apply' : '');

  return (
    <>
      <div className="progress-bar" style={{ width: progressPct + '%' }} />
      <div className="screen">
        <div className="q-nav">
          {current > 0 ? (
            <button className="btn-back" onClick={onBack}>← Back</button>
          ) : (
            <span />
          )}
          <div className="q-meta">{current + 1} of {questions.length}</div>
        </div>
        <div className="q-text">{q.text}</div>
        {hint && <div className="q-hint">{hint}</div>}
        <div className="options">
          {q.opts.map((opt, i) => {
            const sel = selectedIndices.has(i);
            if (q.multi) {
              return (
                <button
                  key={i}
                  className={`option${sel ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
                  onClick={() => !disabled && onToggleMulti(i)}
                >
                  <span className="check">
                    {sel && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            }
            return (
              <button
                key={i}
                className={`option${sel ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
                onClick={() => !disabled && onPickSingle(i)}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
        <button
          className="btn-continue"
          onClick={onContinue}
          style={{ visibility: showContinue ? 'visible' : 'hidden' }}
        >
          Continue →
        </button>
      </div>
    </>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Quiz() {
  const [screen, setScreen]                     = useState<Screen>('landing');
  const [current, setCurrent]                   = useState(0);
  const [dimScores, setDimScores]               = useState<Accumulator>(makeDimScores);
  const [pillarScores, setPillarScores]         = useState<Accumulator>(makePillarScores);
  const [questionScores, setQuestionScores]     = useState<number[]>(() => new Array(questions.length).fill(0));
  const [questionSelections, setQuestionSelections] = useState<Set<number>[]>(() => questions.map(() => new Set<number>()));
  const [selectedIndices, setSelectedIndices]   = useState<Set<number>>(new Set());
  const [singleDisabled, setSingleDisabled]     = useState(false);

  useEffect(() => {
    setSelectedIndices(new Set(questionSelections[current]));
    setSingleDisabled(false);
  }, [current, screen]); // eslint-disable-line react-hooks/exhaustive-deps

  function demoFill() {
    const newDim = makeDimScores();
    const newPil = makePillarScores();
    const newQS  = new Array(questions.length).fill(0);
    const newSel = questions.map(q => {
      if (q.multi) {
        const count = Math.floor(Math.random() * 2) + 1;
        const idxs  = new Set<number>();
        while (idxs.size < Math.min(count, q.opts.length)) idxs.add(Math.floor(Math.random() * q.opts.length));
        return idxs;
      }
      return new Set([Math.floor(Math.random() * q.opts.length)]);
    });
    questions.forEach((q, i) => {
      const scores = [...newSel[i]].map(idx => q.opts[idx].score);
      const avg    = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      newQS[i]     = avg;
      recordScore(q, avg, newDim, newPil);
    });
    setDimScores(newDim); setPillarScores(newPil);
    setQuestionScores(newQS); setQuestionSelections(newSel);
    setScreen('result');
  }

  function startQuiz() {
    setCurrent(0);
    setDimScores(makeDimScores());
    setPillarScores(makePillarScores());
    setQuestionScores(new Array(questions.length).fill(0));
    setQuestionSelections(questions.map(() => new Set<number>()));
    setSelectedIndices(new Set());
    setSingleDisabled(false);
    setScreen('question');
  }

  function advance() {
    const q      = questions[current];
    const scores = [...selectedIndices].map(i => q.opts[i].score);
    const avg    = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const newDim = { ...dimScores, [q.dim]: { ...dimScores[q.dim] } };
    const newPil = { ...pillarScores };
    pillars.forEach(p => { newPil[p] = { ...newPil[p] }; });
    recordScore(q, avg, newDim, newPil);
    const newQS  = [...questionScores]; newQS[current] = avg;
    const newSel = [...questionSelections]; newSel[current] = new Set(selectedIndices);
    setDimScores(newDim); setPillarScores(newPil);
    setQuestionScores(newQS); setQuestionSelections(newSel);
    if (current + 1 < questions.length) setCurrent(current + 1);
    else setScreen('result');
  }

  function pickSingle(i: number) {
    setSingleDisabled(true);
    const q   = questions[current];
    const s   = q.opts[i].score;
    setSelectedIndices(new Set([i]));
    const newDim = { ...dimScores, [q.dim]: { ...dimScores[q.dim] } };
    const newPil = { ...pillarScores };
    pillars.forEach(p => { newPil[p] = { ...newPil[p] }; });
    recordScore(q, s, newDim, newPil);
    const newQS  = [...questionScores]; newQS[current] = s;
    const newSel = [...questionSelections]; newSel[current] = new Set([i]);
    setDimScores(newDim); setPillarScores(newPil);
    setQuestionScores(newQS); setQuestionSelections(newSel);
    setTimeout(() => {
      if (current + 1 < questions.length) setCurrent(current + 1);
      else setScreen('result');
    }, 380);
  }

  function toggleMulti(i: number) {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  function back() {
    if (current === 0) return;
    const prev   = current - 1;
    const q      = questions[prev];
    const s      = questionScores[prev];
    const newDim = { ...dimScores, [q.dim]: { ...dimScores[q.dim] } };
    const newPil = { ...pillarScores };
    pillars.forEach(p => { newPil[p] = { ...newPil[p] }; });
    unrecordScore(q, s, newDim, newPil);
    const newQS = [...questionScores]; newQS[prev] = 0;
    setDimScores(newDim); setPillarScores(newPil);
    setQuestionScores(newQS); setCurrent(prev);
  }

  if (screen === 'landing') return <LandingScreen onStart={startQuiz} onDemo={demoFill} />;

  if (screen === 'question') {
    return (
      <QuestionScreen
        current={current}
        selectedIndices={selectedIndices}
        disabled={singleDisabled}
        onToggleMulti={toggleMulti}
        onPickSingle={pickSingle}
        onContinue={advance}
        onBack={back}
      />
    );
  }

  return (
    <ResultScreen
      dimScores={dimScores}
      pillarScores={pillarScores}
      questionScores={questionScores}
      questionSelections={questionSelections}
      onRetake={startQuiz}
    />
  );
}
