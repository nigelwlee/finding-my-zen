# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Finding My Zen — a minimalist web app for daily stoic reflections. Flip a coin, receive a quote. One flip per day.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + CSS Modules (coin animation)
- **Auth + DB**: Supabase (PostgreSQL + Auth + RLS)
- **Animation**: CSS @keyframes (coin flip) + Framer Motion (quote reveal)
- **Deployment**: Vercel

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — React components
- `src/lib/` — Utilities (Supabase clients, quote selection)
- `src/hooks/` — Custom React hooks
- `supabase/` — Database migrations and seed data

## Design System

Cool monochrome palette. 8px grid spacing. Inter font. See `.claude/skills/design-guide/SKILL.md` for full design guidelines.

## Workflow

All changes must follow this workflow:

1. **Linear first** — Create an issue in the "Finding My Zen" project (team: Nigel Hobby, key: NIG) before writing any code
2. **Commit with issue reference** — Include the Linear issue ID (e.g., `NIG-21`) in the commit message so it auto-links
3. **Update Linear** — Mark the issue as Done after code is committed and pushed
4. **Deploy** — Push to main triggers Vercel deployment

Never skip Linear. Even small fixes get an issue.

## Key Patterns

- Anonymous users: localStorage for flip state
- Authenticated users: Supabase DB for flip persistence
- One flip per day enforced at DB level (unique index on user_id + flipped_on)
- Quote selection avoids repeats for authenticated users
