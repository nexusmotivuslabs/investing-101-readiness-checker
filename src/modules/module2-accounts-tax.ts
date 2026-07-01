import { buildModuleResult } from "../lib/result-engine";
import type { Answers, ModuleDefinition } from "../lib/types";

const questions = [
  {
    id: "isaVsGia",
    prompt: "Do you understand the difference between an ISA and a general investment account?",
    detail:
      "An ISA is a tax-efficient wrapper with annual limits. A general investment account (GIA) has no ISA wrapper but different tax treatment on gains and income.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I know they are different account wrappers with different tax rules." },
      { value: "no" as const, label: "No", detail: "I am not clear on how they differ." },
      { value: "unsure" as const, label: "Not sure", detail: "I have heard of them but cannot explain the difference." },
    ],
  },
  {
    id: "isaAllowance",
    prompt: "Do you know that ISA contributions have an annual limit?",
    detail: "The UK government sets a yearly ISA subscription limit. Exceeding it or misunderstanding it can cause problems.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I know there is a yearly limit and I should check the current figure." },
      { value: "no" as const, label: "No", detail: "I did not know there was a limit." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to look up the current rules." },
    ],
  },
  {
    id: "pensionBasics",
    prompt: "Do you understand that pension contributions may receive tax relief?",
    detail: "Workplace and personal pensions often benefit from tax relief, but rules, access ages, and charges vary.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I understand pensions have tax advantages and access restrictions." },
      { value: "no" as const, label: "No", detail: "I do not understand how pension tax relief works." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to read up on pension basics first." },
    ],
  },
  {
    id: "taxChanges",
    prompt: "Do you know that tax rules and allowances can change?",
    detail: "Budgets and policy changes can affect ISA limits, dividend tax, capital gains tax, and pension rules.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I will check current rules rather than rely on old information." },
      { value: "no" as const, label: "No", detail: "I assumed the rules stay the same forever." },
      { value: "unsure" as const, label: "Not sure", detail: "I am not confident I know what might change." },
    ],
  },
  {
    id: "noAccountRecommendation",
    prompt: "Are you clear this module does not recommend a specific account type for you?",
    detail: "The right wrapper depends on your goals, time horizon, and tax position. This is education, not personalised advice.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I will research or seek advice before opening an account." },
      { value: "no" as const, label: "No", detail: "I expected this app to tell me which account to open." },
      { value: "unsure" as const, label: "Not sure", detail: "I need help understanding how to decide." },
    ],
  },
];

export const module2: ModuleDefinition = {
  id: "accounts-tax-basics",
  number: 2,
  title: "Accounts and Tax Basics",
  shortDescription: "Learn ISA, GIA, and pension basics before choosing where to invest.",
  contextLabel: "Module 2: Accounts and Tax Basics",
  feedbackPrompt: "Do you feel clearer about account types and tax basics?",
  questions,
  getResult: (answers: Answers) =>
    buildModuleResult(answers, questions, {
      blockers: [
        {
          questionId: "isaVsGia",
          blockingValues: ["no"],
          issue: "the difference between ISA and general investment accounts is not clear",
          nextAction: "Read HMRC and FCA educational guides on ISAs and general investment accounts before opening anything.",
          warning: "Opening the wrong account type can mean paying more tax than necessary or breaking ISA rules.",
        },
        {
          questionId: "isaAllowance",
          blockingValues: ["no"],
          issue: "the ISA annual subscription limit is not understood",
          nextAction: "Check the current ISA allowance on gov.uk before subscribing to an ISA.",
          warning: "Breaching ISA subscription rules can lead to penalties and administrative hassle.",
        },
        {
          questionId: "pensionBasics",
          blockingValues: ["no"],
          issue: "pension tax relief and access rules are not understood",
          nextAction: "Review how workplace and personal pensions work, including when you can access the money.",
          warning: "Pension money is usually locked until a minimum age — do not invest pension contributions without understanding access rules.",
        },
        {
          questionId: "taxChanges",
          blockingValues: ["no"],
          issue: "tax rules are assumed to be fixed",
          nextAction: "Bookmark official sources and review tax allowances each tax year.",
          warning: "Relying on outdated tax information can lead to poor planning decisions.",
        },
        {
          questionId: "noAccountRecommendation",
          blockingValues: ["no"],
          issue: "there is an expectation of personalised account recommendations",
          nextAction: "Use this app for education only. Consider a qualified adviser or MoneyHelper for personalised guidance.",
          warning: "No educational app can tell you which account is right for your personal tax situation.",
        },
      ],
      pause: {
        title: "Build account and tax knowledge first",
        explanationPrefix: "Your answers show gaps in",
      },
      clarify: {
        title: "Clarify account and tax basics",
        explanationPrefix: 'You selected "Not sure" for',
        nextAction: "Note which topics are unclear, then revisit official HMRC and FCA resources before choosing an account.",
        warning: "Do not open investment accounts until you understand the tax wrapper and access rules that apply.",
      },
      ready: {
        title: "You have a solid foundation on accounts and tax",
        explanation:
          "Your answers suggest you understand the core concepts. This does not mean a specific account type is right for you.",
        nextAction: "Move to Module 3 to learn about fees and platform questions before comparing providers.",
        warning:
          "Tax rules change. Always verify current allowances and seek professional advice for complex situations.",
      },
    }),
};
