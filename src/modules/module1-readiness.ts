import { buildModuleResult } from "../lib/result-engine";
import type { Answers, ModuleDefinition } from "../lib/types";

const questions = [
  {
    id: "emergencyFund",
    prompt: "Do you have money set aside for unexpected costs?",
    detail: "Think about rent, bills, repairs, travel, or income gaps.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I have a cash buffer I can access." },
      { value: "no" as const, label: "No", detail: "I would struggle with an unexpected cost." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to check what is available." },
    ],
  },
  {
    id: "essentialBills",
    prompt: "Are your essential bills and debt payments up to date?",
    detail: "Include rent or mortgage, utilities, minimum debt payments, council tax, and insurance.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "My regular commitments are covered." },
      { value: "no" as const, label: "No", detail: "Some commitments need attention first." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to review my monthly commitments." },
    ],
  },
  {
    id: "highInterestDebt",
    prompt: "Do you have high-interest debt that you are not already clearing?",
    detail: "This can include expensive credit cards, overdrafts, payday loans, or buy-now-pay-later debt.",
    options: [
      { value: "no" as const, label: "No", detail: "I do not have this, or I have a clear repayment plan." },
      { value: "yes" as const, label: "Yes", detail: "This is still unresolved." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to check rates and repayment costs." },
    ],
  },
  {
    id: "nearTermCash",
    prompt: "Could you leave the money untouched for at least five years?",
    detail: "Investing is usually a longer-term decision, not a place for short-term bills or planned spending.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "This money is not needed for near-term plans." },
      { value: "no" as const, label: "No", detail: "I may need it sooner." },
      { value: "unsure" as const, label: "Not sure", detail: "I have not separated short-term and long-term money yet." },
    ],
  },
  {
    id: "riskComfort",
    prompt: "Are you comfortable that investments can fall in value?",
    detail: "The value can move sharply and you could get back less than you put in.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I understand losses are possible." },
      { value: "no" as const, label: "No", detail: "I would not be comfortable with that risk yet." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to learn more before deciding." },
    ],
  },
];

export const module1: ModuleDefinition = {
  id: "before-you-invest",
  number: 1,
  title: "Before You Invest",
  shortDescription: "Five readiness questions, a rule-based result, and one feedback check.",
  contextLabel: "Module 1: Before You Invest",
  feedbackPrompt: "Do you know your next financial step?",
  feedbackMetricLabel: "Phase 1 success metric",
  questions,
  getResult: (answers: Answers) =>
    buildModuleResult(answers, questions, {
      blockers: [
        {
          questionId: "emergencyFund",
          blockingValues: ["no"],
          issue: "an emergency cash buffer is not in place",
          nextAction: "Build or confirm an accessible cash buffer before putting money at investment risk.",
          warning: "Investing money needed for emergencies can force you to sell at a bad time.",
        },
        {
          questionId: "essentialBills",
          blockingValues: ["no"],
          issue: "essential bills or debt payments need attention",
          nextAction: "Stabilise regular commitments before thinking about investment accounts or products.",
          warning: "Investing should not compete with rent, bills, minimum debt payments, or insurance.",
        },
        {
          questionId: "highInterestDebt",
          blockingValues: ["yes"],
          issue: "high-interest debt may need to be dealt with first",
          nextAction: "Review the cost of that debt and make a clear repayment plan before investing.",
          warning: "High-interest debt can grow faster than uncertain investment outcomes.",
        },
        {
          questionId: "nearTermCash",
          blockingValues: ["no"],
          issue: "the money may be needed within five years",
          nextAction: "Separate short-term cash needs from any money you may later consider for long-term investing.",
          warning: "Investments can be down when you need the money back.",
        },
        {
          questionId: "riskComfort",
          blockingValues: ["no"],
          issue: "investment risk is not yet clear or comfortable",
          nextAction: "Learn how market falls, time horizon, and loss risk work before choosing any product.",
          warning: "You should not invest until you understand that losses are possible.",
        },
      ],
      pause: {
        title: "Pause before investing",
        explanationPrefix: "Your answers show",
      },
      clarify: {
        title: "Check a few basics before continuing",
        explanationPrefix: 'You selected "Not sure" for',
        explanationSuffix:
          "That is a sign to slow down before comparing accounts, funds, stocks, or crypto.",
        nextAction: "Write down what is unclear, check your budget and commitments, then retake this module.",
        warning: "Do not invest money until you understand your cash needs, debt position, and risk tolerance.",
      },
      ready: {
        title: "You can move to the next education step",
        explanation:
          "Your answers suggest the core readiness checks are in place. This does not mean any investment is suitable for you.",
        nextAction:
          "Continue to Module 2 to learn account types and tax basics before comparing platforms or products.",
        warning:
          "This checker is education only and is not financial advice. Investments can fall in value and you could get back less than you put in.",
      },
    }),
};
