# CLAUDE.md — Professional Website

This file contains standing instructions for Claude. Read it at the start of every session.

---

## Project overview

This is a **professional portfolio website** for Ilja Vorstermans, with potential limited extension into a full-stack web application (e.g. a contact form, CMS, or simple backend). The tech stack has not yet been decided.

---

## Communication style

- **Explain decisions in plain language.** I operate at the intersection of business and IT. Do not assume deep technical knowledge. When a technical choice has implications (cost, complexity, maintainability, scalability), explain those implications so I can make an informed decision.
- **Ask when unsure.** If the intent or requirement is ambiguous, ask before proceeding.
- **When I give new standing instructions**, propose adding them to this CLAUDE.md file at the end of the conversation.

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

## Tech stack (TBD)

The stack has not been chosen yet. When the time comes to choose, present options using the format described above with a focus on:
- Ease of use for someone not deeply technical
- Long-term maintainability
- Hosting cost and complexity
- How well it fits a portfolio site with potential light dynamic features
