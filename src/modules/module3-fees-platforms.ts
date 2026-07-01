import { buildModuleResult } from "../lib/result-engine";
import type { Answers, ModuleDefinition } from "../lib/types";

const questions = [
  {
    id: "feeAwareness",
    prompt: "Do you know that investing platforms charge fees?",
    detail: "Common charges include platform fees, fund ongoing charges, trading costs, and sometimes FX conversion fees.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I know fees exist and affect long-term returns." },
      { value: "no" as const, label: "No", detail: "I thought investing was mostly free." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to learn what fees platforms charge." },
    ],
  },
  {
    id: "compareFees",
    prompt: "Can you find and compare the main fees before opening an account?",
    detail: "Look for platform charges, fund charges, trading fees, and any currency conversion costs in the fee schedule.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I know where to find fee schedules and how to compare them." },
      { value: "no" as const, label: "No", detail: "I would not know where to look." },
      { value: "unsure" as const, label: "Not sure", detail: "I have not compared fees before." },
    ],
  },
  {
    id: "lowestNotAlwaysBest",
    prompt: "Do you understand that the lowest fees are not always the best choice?",
    detail: "Features, customer service, available investments, and ease of use also matter alongside cost.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I will weigh fees against features and my needs." },
      { value: "no" as const, label: "No", detail: "I assumed I should always pick the cheapest platform." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to think about what else matters besides fees." },
    ],
  },
  {
    id: "fxFees",
    prompt: "Do you understand currency conversion fees for international investments?",
    detail: "Buying US or global shares often involves FX spreads or conversion charges on top of platform fees.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I know FX costs can add up for international holdings." },
      { value: "no" as const, label: "No", detail: "I did not know currency conversion could cost extra." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to check how a platform handles FX." },
    ],
  },
  {
    id: "unrealisticReturns",
    prompt: "Are you wary of platforms or influencers promising unrealistic returns?",
    detail: "Guaranteed high returns, pressure to sign up quickly, and unclear fee disclosure are red flags.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I treat guaranteed-return claims with scepticism." },
      { value: "no" as const, label: "No", detail: "I might be swayed by impressive return claims." },
      { value: "unsure" as const, label: "Not sure", detail: "I am not confident I could spot misleading marketing." },
    ],
  },
];

export const module3: ModuleDefinition = {
  id: "fees-platform-questions",
  number: 3,
  title: "Fees and Platform Questions",
  shortDescription: "Understand platform fees, comparisons, and what to ask before signing up.",
  contextLabel: "Module 3: Fees and Platform Questions",
  feedbackPrompt: "Do you feel confident comparing platform fees?",
  questions,
  getResult: (answers: Answers) =>
    buildModuleResult(answers, questions, {
      blockers: [
        {
          questionId: "feeAwareness",
          blockingValues: ["no"],
          issue: "platform and fund fees are not understood",
          nextAction: "Read a platform's fee schedule and learn about ongoing fund charges before investing.",
          warning: "Fees compound over time and can significantly reduce long-term returns.",
        },
        {
          questionId: "compareFees",
          blockingValues: ["no"],
          issue: "fee comparison skills are not in place",
          nextAction: "Practice comparing two platforms' fee pages side by side using the same investment scenario.",
          warning: "Choosing a platform without understanding fees can mean paying more than necessary for years.",
        },
        {
          questionId: "lowestNotAlwaysBest",
          blockingValues: ["no"],
          issue: "fees are assumed to be the only decision factor",
          nextAction: "List what you need from a platform (ISA support, funds, research tools) alongside the fee comparison.",
          warning: "A cheap platform that lacks features you need may cost you in time, mistakes, or unsuitable products.",
        },
        {
          questionId: "fxFees",
          blockingValues: ["no"],
          issue: "currency conversion costs are not understood",
          nextAction: "Check how your chosen platform charges for buying non-UK investments before trading internationally.",
          warning: "FX fees can turn a seemingly cheap trade into an expensive one.",
        },
        {
          questionId: "unrealisticReturns",
          blockingValues: ["no"],
          issue: "unrealistic return claims may not be recognised",
          nextAction: "Learn common scam and misleading marketing patterns before choosing any platform or product.",
          warning: "Platforms or promoters promising guaranteed high returns are a major warning sign.",
        },
      ],
      pause: {
        title: "Understand fees before choosing a platform",
        explanationPrefix: "Your answers show gaps in",
      },
      clarify: {
        title: "Clarify fee and platform basics",
        explanationPrefix: 'You selected "Not sure" for',
        nextAction: "Write down the fees you do not understand, then read each platform's fee schedule with those in mind.",
        warning: "Never transfer money to a platform until you understand what you will be charged.",
      },
      ready: {
        title: "You are ready to compare platforms thoughtfully",
        explanation:
          "Your answers suggest you understand how fees work and what questions to ask. This does not recommend any specific platform.",
        nextAction: "Move to Module 4 to learn about risk, diversification, and how to spot scams.",
        warning: "Platforms change their fees. Re-check fee schedules periodically and after any account changes.",
      },
    }),
};
