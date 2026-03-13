'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Accumulator } from '@/app/quiz/data';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PendingResult {
  score: number;
  pillarScores: Record<string, number>;
  dimScores: Record<string, { score: number; max: number }>;
}

const PENDING_KEY = 'pendingQuizResult';

export function storePendingResult(result: PendingResult) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(PENDING_KEY, JSON.stringify(result));
  }
}

function loadPendingResult(): PendingResult | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingResult) : null;
  } catch {
    return null;
  }
}

function clearPendingResult() {
  localStorage.removeItem(PENDING_KEY);
}

// ── Component ─────────────────────────────────────────────────────────────────

type SaveState =
  | 'idle'         // not yet interacted
  | 'form'         // email input shown
  | 'sending'      // waiting for magic link to send
  | 'sent'         // magic link sent, waiting for user to click it
  | 'saving'       // user returned, saving to DB
  | 'saved'        // score saved successfully
  | 'error';       // something went wrong

interface Props {
  score: number;
  pillarScores: Accumulator;
  dimScores: Accumulator;
}

export default function SaveScore({ score, pillarScores, dimScores }: Props) {
  const [state, setState]           = useState<SaveState>('idle');
  const [email, setEmail]           = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg]     = useState('');
  const supabase                    = createClient();

  // On mount: check if user just returned from a magic link click
  useEffect(() => {
    async function checkAndSave() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check URL for the ?saved=1 flag set by the auth callback
      const params = new URLSearchParams(window.location.search);
      if (!params.has('saved')) return;

      // Remove the flag from the URL without a page reload
      const clean = new URL(window.location.href);
      clean.searchParams.delete('saved');
      window.history.replaceState({}, '', clean.toString());

      // Try to save the pending result stored before the magic link redirect
      const pending = loadPendingResult();
      if (!pending) {
        // User signed in but no pending result - already saved or came from elsewhere
        setState('saved');
        return;
      }

      setState('saving');
      const { error } = await supabase.from('quiz_results').insert({
        user_id:      user.id,
        score:        pending.score,
        pillar_scores: pending.pillarScores,
        dim_scores:   pending.dimScores,
      });

      if (error) {
        console.error('Failed to save score:', error);
        setErrorMsg('Score could not be saved. Please try again.');
        setState('error');
      } else {
        clearPendingResult();
        setState('saved');
      }
    }

    checkAndSave();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSend() {
    if (!email.trim()) return;
    setState('sending');

    // Persist the result before we redirect away
    const pillarPcts = Object.fromEntries(
      Object.entries(pillarScores).map(([k, v]) => [k, v.max ? Math.round((v.score / v.max) * 100) : 0])
    );
    storePendingResult({ score, pillarScores: pillarPcts, dimScores });

    const redirectTo = `${window.location.origin}/auth/callback?next=/quiz`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        data: { display_name: displayName.trim() || email.split('@')[0] },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setState('error');
    } else {
      setState('sent');
    }
  }

  // ── Render states ────────────────────────────────────────────────────────

  if (state === 'saved') {
    return (
      <div className="save-score-block save-score-block--saved">
        <span className="save-score-icon">✓</span>
        <div>
          <div className="save-score-title">Score saved</div>
          <div className="save-score-sub">You&apos;re on the leaderboard.</div>
        </div>
      </div>
    );
  }

  if (state === 'saving') {
    return (
      <div className="save-score-block">
        <div className="save-score-title">Saving your score...</div>
      </div>
    );
  }

  if (state === 'sent') {
    return (
      <div className="save-score-block">
        <div className="save-score-title">Check your inbox</div>
        <div className="save-score-sub">
          We sent a sign-in link to <strong>{email}</strong>. Click it and your score will be saved automatically.
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="save-score-block save-score-block--error">
        <div className="save-score-title">Something went wrong</div>
        <div className="save-score-sub">{errorMsg}</div>
        <button className="save-score-btn" onClick={() => setState('form')}>Try again</button>
      </div>
    );
  }

  if (state === 'form' || state === 'sending') {
    return (
      <div className="save-score-block">
        <div className="save-score-title">Save your score</div>
        <div className="save-score-sub">We&apos;ll email you a sign-in link. No password needed.</div>
        <div className="save-score-fields">
          <input
            className="save-score-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <input
            className="save-score-input"
            type="text"
            placeholder="Display name (optional)"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            className="save-score-btn"
            onClick={handleSend}
            disabled={state === 'sending' || !email.trim()}
          >
            {state === 'sending' ? 'Sending...' : 'Send link →'}
          </button>
        </div>
      </div>
    );
  }

  // idle state - teaser
  return (
    <div className="save-score-block save-score-block--idle">
      <div>
        <div className="save-score-title">Save your score</div>
        <div className="save-score-sub">Track your progress and compare with others.</div>
      </div>
      <button className="save-score-btn" onClick={() => setState('form')}>
        Save →
      </button>
    </div>
  );
}
