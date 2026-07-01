# Investing 101

A frontend-only educational web app that helps **UK beginner investors** learn the basics they should understand **before** choosing investments, platforms, accounts, ETFs, stocks, or crypto.

Built as a guided learning path with four short modules. Each module uses a five-question checker, rule-based results, and a feedback step. There is no backend, no login, and no collection of sensitive financial data.

> **Important:** This app is educational only. It does not provide investment recommendations, expected returns, product suggestions, portfolio allocations, platform suggestions, or personalised financial advice.

---

## Table of contents

- [Who this is for](#who-this-is-for)
- [What problem it solves](#what-problem-it-solves)
- [How it works](#how-it-works)
- [Learning modules](#learning-modules)
- [Result logic](#result-logic)
- [User flows](#user-flows)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Progress tracking](#progress-tracking)
- [Analytics](#analytics)
- [Privacy and data](#privacy-and-data)
- [Design principles](#design-principles)
- [Adding a new module](#adding-a-new-module)
- [What's intentionally excluded](#whats-intentionally-excluded)
- [Release checklist](#release-checklist)

---

## Who this is for

UK adults who are curious about investing but may not yet have covered the groundwork:

- Emergency savings and essential bills
- High-interest debt
- Time horizon and risk comfort
- Account types and tax wrappers (ISA, GIA, pension)
- Platform fees and how to compare them
- Diversification basics and scam awareness

The tone is plain English, cautious, and aimed at people who have not yet opened an investment account.

---

## What problem it solves

Many beginners jump straight to comparing platforms, funds, or crypto without checking whether they are financially ready or whether they understand fees, tax wrappers, and risk.

Investing 101 slows that down. It sequences education in a fixed order and gives each user a clear, rule-based outcome: pause, clarify, or continue learning. It never tells someone *what* to buy or *where* to invest.

---

## How it works

1. **Homepage** — shows all four modules and overall course progress.
2. **Checker** — five questions per module, answered yes / no / not sure, with back navigation.
3. **Result** — explanation, next action, and warning based on rule logic.
4. **Feedback** — one question per module (e.g. “Do you know your next financial step?”).
5. **Progress** — completion is saved in the browser so users can resume or review modules.

Users can restart a module, edit individual answers from the result screen, or move to the next module when finished.

---

## Learning modules

| # | ID | Title | What it covers |
|---|-----|-------|----------------|
| 1 | `before-you-invest` | **Before You Invest** | Emergency fund, bills, high-interest debt, 5-year time horizon, risk comfort |
| 2 | `accounts-tax-basics` | **Accounts and Tax Basics** | ISA vs GIA, ISA allowance, pension tax relief, changing tax rules, no account recommendations |
| 3 | `fees-platform-questions` | **Fees and Platform Questions** | Platform and fund fees, fee comparison, FX costs, unrealistic return claims |
| 4 | `risk-diversification-scams` | **Risk, Diversification, and Scams** | Concentration risk, diversification, scam red flags, FCA register, risk-return trade-off |

Each module follows the same structure:

- 5 questions with supporting detail text
- Module-specific blocking rules (see below)
- Result screen with explanation, next action, warning, and answer summary
- Feedback question
- Link to the next module (or back to home after Module 4)

### Module 1 success metric

Module 1 tracks whether users answer **“Yes”** to:

> *Do you know your next financial step?*

This is the primary Phase 1 success metric for measuring whether the checker helped users leave with clarity.

---

## Result logic

Every module uses the same three outcome types, evaluated in this order:

### 1. Not ready yet (`pause`)

Triggered when one or more **blocking answers** are selected. Blockers are defined per module and per question. Examples:

| Module | Example blocker |
|--------|-----------------|
| 1 | No emergency fund · essential bills not covered · unresolved high-interest debt |
| 2 | Does not understand ISA vs GIA · unaware of ISA annual limit |
| 3 | Unaware that platforms charge fees · would trust unrealistic return claims |
| 4 | Does not understand concentration risk · cannot spot scam signs |

### 2. Clarify first (`clarify`)

No blockers, but one or more answers are **“Not sure”**. The user is encouraged to slow down and fill knowledge gaps before continuing.

### 3. Ready to keep learning (`ready`)

All questions answered with no blockers and no “not sure” responses. This does **not** mean the user should invest — only that they can proceed to the next educational step.

Result copy (title, explanation, next action, warning) is defined per module in `src/modules/`.

---

## User flows

```
Home
 ├── Start Module 1–4
 │    ├── Question 1 → … → Question 5
 │    ├── Result (pause | clarify | ready)
 │    │    ├── Change answer → back to checker
 │    │    ├── Feedback (yes / no)
 │    │    ├── Restart module
 │    │    └── Next module (or home after Module 4)
 │    └── Back → previous question or home
 └── Review completed module (same flow, progress retained)
```

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4, custom CSS variables |
| Fonts | Geist Sans / Geist Mono (via `next/font`) |
| State | React `useState` / `useMemo` (client-only) |
| Persistence | `localStorage` |
| Backend | None |

The app is a single client-rendered page (`src/app/page.tsx`) with no API routes or server actions.

---

## Project structure

```
investing-101-readiness-checker/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main app state and routing (home | checker | result)
│   │   ├── layout.tsx        # Root layout and metadata
│   │   └── globals.css       # Design tokens and component styles
│   ├── components/
│   │   ├── HomeView.tsx      # Module grid and course progress
│   │   └── ModuleFlow.tsx    # Checker and result screens
│   ├── lib/
│   │   ├── analytics.ts      # Event tracking placeholders
│   │   ├── progress.ts       # localStorage read/write
│   │   ├── result-engine.ts  # Shared blocker / clarify / ready logic
│   │   └── types.ts          # Shared TypeScript types
│   └── modules/
│       ├── index.ts          # Module registry
│       ├── module1-readiness.ts
│       ├── module2-accounts-tax.ts
│       ├── module3-fees-platforms.ts
│       └── module4-risk-scams.ts
├── public/
├── package.json
└── README.md
```

### Key files

- **`src/modules/*.ts`** — question copy, blocking rules, and result messaging for each module.
- **`src/lib/result-engine.ts`** — `buildModuleResult()` applies blocker → clarify → ready logic.
- **`src/lib/progress.ts`** — stores `{ moduleId: { completed, resultKey, feedback } }` under `investing101-progress`.

---

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # Production build
npm run start   # Serve production build
npm run lint    # ESLint
```

### Production

Deploy as a static Next.js app (e.g. Vercel). No environment variables are required for core functionality.

---

## Progress tracking

Progress is stored in the browser:

| Key | Value |
|-----|-------|
| `localStorage` key | `investing101-progress` |
| Shape | `{ [moduleId]: { completed, resultKey?, feedback? } }` |

- Marked complete when a user finishes all five questions and reaches the result screen.
- Feedback answer is saved when the user responds on the result screen.
- Clearing site data resets progress.
- No data is sent to a server.

---

## Analytics

Analytics are **placeholders** for a future integration (e.g. Google Tag Manager). Each event is:

1. Pushed to `window.investing101Analytics[]`
2. Pushed to `window.dataLayer[]`
3. Logged to the console as `[analytics placeholder]`

| Event | When it fires |
|-------|----------------|
| `homepage_viewed` | First homepage load |
| `module_card_viewed` | Each module card seen on homepage |
| `module_started` | User starts a module |
| `question_answered` | User selects an answer |
| `question_back_clicked` | User goes back |
| `answer_edit_clicked` | User edits an answer from results |
| `module_completed` | User finishes all questions |
| `result_viewed` | Result screen shown |
| `feedback_answered` | User answers feedback question |
| `restart_clicked` | User restarts a module |

To wire up real analytics, replace or extend `trackEvent()` in `src/lib/analytics.ts`.

---

## Privacy and data

The app **does not** collect:

- Salary or income
- Bank balances
- Account providers or account numbers
- Creditor names
- Names, emails, or other personal identifiers

All answers exist only in memory during a session (except module completion metadata in `localStorage`). There is no authentication and no server-side storage.

---

## Design principles

1. **Education, not advice** — explain concepts; never recommend products or platforms.
2. **Sequence matters** — readiness before accounts, accounts before fees, fees before risk.
3. **Rule-based, not AI** — deterministic outcomes from explicit blocking rules.
4. **Plain language** — short questions, supporting detail, no jargon without explanation.
5. **Cautious by default** — every result screen includes a warning; crypto FSCS disclaimer on results.
6. **Frontend-only** — no backend complexity for the MVP; easy to deploy and audit.

---

## Adding a new module

1. Create `src/modules/moduleN-your-topic.ts` exporting a `ModuleDefinition`.
2. Define questions, `getResult()` via `buildModuleResult()`, and feedback copy.
3. Register it in `src/modules/index.ts`.
4. No routing changes needed — the homepage and flow read from the module registry.

See existing modules for the pattern.

---

## What's intentionally excluded

| Feature | Status |
|---------|--------|
| Backend / API | Not included |
| Database | Not included |
| Login / subscriptions | Not included |
| AI recommendations | Not included |
| Portfolio tracking | Not included |
| Product or platform recommendations | Not included |
| Personalised financial advice | Not included |
| Real analytics provider | Placeholder only |

These are deliberate scope boundaries for the educational MVP.

---

## Release checklist

Before shipping a release:

- [ ] Complete all four modules on desktop and mobile
- [ ] Confirm back navigation works on every question
- [ ] Confirm all three result types (`pause`, `clarify`, `ready`) can appear
- [ ] Confirm result screens show explanation, next action, and warning
- [ ] Confirm no products, providers, portfolios, or platforms are recommended
- [ ] Confirm no sensitive financial data is requested
- [ ] Confirm analytics placeholders fire for core events
- [ ] Confirm restart clears in-session answers and feedback
- [ ] Confirm progress persists across page reloads
- [ ] Run `npm run lint`
- [ ] Run `npm run build`

---

## Repository

```
git@github.com:nexusmotivuslabs/investing-101-readiness-checker.git
```

---

## Licence

Private project (`"private": true` in `package.json`). Contact the repository owner for usage terms.
