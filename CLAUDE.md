# CLAUDE.md — Professional Website

This file contains standing instructions for Claude. Read it at the start of every session.

---

## Project overview

This is a **professional portfolio website** for Ilja Vorstermans that doubles as a platform for the Digital Autonomy Quiz. It serves two interconnected goals:

1. **Mission:** Raise awareness of European strategic autonomy and Big Tech dependence. Ilja genuinely cares about reducing Europe's reliance on US tech platforms and wants the site to contribute to that, even in a small way.
2. **Lead generation:** The quiz is the primary engagement tool. A future SME-focused quiz will make the commercial angle more explicit, but the consumer quiz reaches a broader audience and serves as top-of-funnel.

### Tone and content principles
- **Make it concrete and personal.** Most people don't care about abstract privacy arguments. The goal is to make the implications visceral and specific - not "Google reads your email" but what that actually means for them personally. Think: the Snowden effect (people didn't care until they heard the NSA could see their nudes).
- **Evidence-based.** All claims should be grounded in credible sources: academic papers, EU institutions, or well-regarded references like https://european-alternatives.eu/categories. Avoid vague or unsubstantiated claims.
- **Accessible, not preachy.** The audience includes everyday people who feel unable to change their Big Tech habits. The tone should be empowering, not guilt-inducing.

### Future features planned
- Email capture on quiz result screen (lead magnet)
- SME-focused quiz (more explicit commercial angle)
- User accounts with leaderboard (Supabase Auth)
- Friends + social comparison
- iOS/Android app (React Native, same Supabase backend)

---

## Communication style

- **Explain decisions in plain language.** I operate at the intersection of business and IT. Do not assume deep technical knowledge. When a technical choice has implications (cost, complexity, maintainability, scalability), explain those implications so I can make an informed decision.
- **Ask when unsure.** If the intent or requirement is ambiguous, ask before proceeding.
- **When I give new standing instructions**, propose adding them to this CLAUDE.md file at the end of the conversation.
- **Never use em dashes (—).** In all copy, code comments, and documentation, use a comma, hyphen, or rewrite the sentence instead.

---

## Presenting options

For any non-trivial decision (architecture, libraries, design patterns, implementation approach):

1. **Present options with letters or numbers** (e.g. A, B, C or 1, 2, 3) for easy reference.
2. For each option, include:
   - A short title
   - What it does / how it works (briefly, non-technical)
   - Pros
   - Cons / trade-offs
3. **Exception:** Straightforward bug fixes do not need options — just fix the bug and explain what you did.

---

## Git & version control

- **Never auto-commit.** Always ask before any `git commit`, `git push`, or destructive git operation.
- Describe what will be committed and why before asking for approval.

---

## Testing

- **Always run tests before finishing a task.** If tests fail, fix the failures before marking the task done.
- If no test suite exists yet, flag this and propose setting one up.

---

## Documentation

- **Document thoroughly.** This project lives in files and may be opened in VS Code, Claude Code, or other tools across sessions. Keep documentation up to date so any tool or collaborator can pick up context quickly.
- When adding a significant new feature or making an architectural decision, update the relevant documentation (this file, a README, or a dedicated doc) as part of the task.

---

## Tech stack

Decided 2026-03-08:

| Layer      | Choice           | Notes                                              |
|------------|------------------|----------------------------------------------------|
| Framework  | Next.js 16 (App Router) | TypeScript, `src/` directory layout         |
| Backend/DB | Supabase         | Auth, PostgreSQL, real-time. Not yet integrated.   |
| Hosting    | Vercel           | Connected to GitHub repo. Not yet set up.          |

### Rationale
- Next.js chosen for native Vercel integration and future-proofing for user accounts + social features.
- Supabase chosen for auth, real-time leaderboard, and mobile-app-compatible API layer.
- Vercel chosen for zero-config deployment and seamless Next.js support.

### Future features planned
- User accounts (Supabase Auth)
- Friends + leaderboard between accounts
- iOS/Android app (React Native consuming the same Supabase backend, no backend refactor needed)

### Project structure
```
src/
  app/
    layout.tsx        — root layout, fonts, metadata
    page.tsx          — redirects / → /quiz
    globals.css       — all global styles
    quiz/
      page.tsx        — route entry point
      Quiz.tsx        — full quiz React component ('use client')
      data.ts         — questions, levels, pillars, recommendations (pure data)
```
