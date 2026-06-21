# Investing 101

Frontend-only MVP for Module 1, "Before You Invest: Readiness Checker".

## Purpose

Investing 101 helps UK beginner investors decide whether they are financially ready to continue learning about investing before they choose investments, platforms, accounts, ETFs, stocks, or crypto.

This app is educational only. It does not provide investment recommendations, expected returns, product suggestions, portfolio allocations, platform suggestions, or personalised financial advice.

## Local Setup

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## MVP Scope

Included:

- Homepage branded as Investing 101.
- Module 1 card for "Before You Invest".
- Five-question readiness checker.
- Back navigation to change answers.
- Rule-based result screen with explanation, next action, and warning.
- Feedback question: "Do you know your next financial step?"
- Restart flow that clears all answers.
- Coming-soon modules shown as unavailable.
- Analytics placeholders for core events.

Excluded:

- Backend.
- Database.
- Login or subscriptions.
- AI recommendations.
- Portfolio tracking.
- Investment product recommendations.
- Collection of salary, bank balances, account providers, creditor names, or personal identifiers.

## Rule Logic

The result is calculated from five readiness areas:

- Emergency cash buffer.
- Essential bills and debt payments.
- High-interest debt.
- Whether the money can stay untouched for at least five years.
- Comfort with investments falling in value.

If a blocking answer is present, the result is "Not ready yet". If no blocking answer is present but one or more answers are "Not sure", the result is "Clarify first". If all checks are clear, the result is "Ready to keep learning".

## Analytics Placeholders

Events are pushed to `window.investing101Analytics` and `window.dataLayer`, and logged to the browser console with the prefix `[analytics placeholder]`.

Core events:

- `homepage_viewed`
- `module_card_viewed`
- `module_started`
- `question_answered`
- `question_back_clicked`
- `answer_edit_clicked`
- `module_completed`
- `result_viewed`
- `feedback_answered`
- `restart_clicked`

The Phase 1 success metric is the percentage of completed Module 1 users who answer "Yes" to: "Do you know your next financial step?"

## Release Checklist

- Complete the full flow on desktop.
- Complete the full flow on mobile.
- Confirm back navigation can change each answer.
- Confirm all three result types can appear from the rule logic.
- Confirm the result screen includes explanation, next action, and warning.
- Confirm no investment products, providers, portfolios, expected returns, or platforms are recommended.
- Confirm no sensitive financial data is requested.
- Confirm analytics placeholders fire for core events.
- Confirm restart clears answers and feedback state.
- Confirm future modules are visible and unavailable.
- Run `npm run lint`.
- Run `npm run build`.
