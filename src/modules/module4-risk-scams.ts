import { buildModuleResult } from "../lib/result-engine";
import type { Answers, ModuleDefinition } from "../lib/types";

const questions = [
  {
    id: "concentrationRisk",
    prompt: "Do you understand that putting all your money in one stock increases risk?",
    detail: "A single company can fall sharply due to bad news, sector problems, or broader market events.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I know concentration in one asset is riskier than spreading out." },
      { value: "no" as const, label: "No", detail: "I thought one good stock was enough." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to learn more about concentration risk." },
    ],
  },
  {
    id: "diversification",
    prompt: "Do you know diversification means spreading across assets, sectors, or regions?",
    detail: "Diversification does not remove risk entirely, but it can reduce the impact of one investment failing.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I understand diversification spreads risk across different holdings." },
      { value: "no" as const, label: "No", detail: "I am not sure what diversification means in practice." },
      { value: "unsure" as const, label: "Not sure", detail: "I have heard the term but cannot explain it." },
    ],
  },
  {
    id: "scamSigns",
    prompt: "Can you spot common investment scam signs?",
    detail: "Warning signs include guaranteed returns, pressure to act fast, unregulated firms, and cold-call offers.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I know several red flags and would verify before sending money." },
      { value: "no" as const, label: "No", detail: "I am not confident I could spot a scam." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to learn what scams look like." },
    ],
  },
  {
    id: "fcaRegistration",
    prompt: "Do you know how to check if a firm is on the FCA register?",
    detail: "The FCA register lists authorised firms. Scammers often claim to be regulated when they are not.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I know to check register.fca.org.uk before trusting a firm." },
      { value: "no" as const, label: "No", detail: "I would not know how to verify a firm." },
      { value: "unsure" as const, label: "Not sure", detail: "I have heard of the FCA but have not checked the register." },
    ],
  },
  {
    id: "riskReturnTradeoff",
    prompt: "Are you comfortable that higher potential returns usually mean higher risk?",
    detail: "There is no free lunch. Promises of high returns with low risk are a classic warning sign.",
    options: [
      { value: "yes" as const, label: "Yes", detail: "I accept that higher returns come with higher uncertainty." },
      { value: "no" as const, label: "No", detail: "I expect high returns without much risk." },
      { value: "unsure" as const, label: "Not sure", detail: "I need to understand the risk-return relationship better." },
    ],
  },
];

export const module4: ModuleDefinition = {
  id: "risk-diversification-scams",
  number: 4,
  title: "Risk, Diversification, and Scams",
  shortDescription: "Learn diversification basics and how to protect yourself from investment scams.",
  contextLabel: "Module 4: Risk, Diversification, and Scams",
  feedbackPrompt: "Do you feel better prepared to spot scams and manage risk?",
  questions,
  getResult: (answers: Answers) =>
    buildModuleResult(answers, questions, {
      blockers: [
        {
          questionId: "concentrationRisk",
          blockingValues: ["no"],
          issue: "concentration risk in a single investment is not understood",
          nextAction: "Learn why holding many different investments can reduce the impact of one failure.",
          warning: "Putting everything into one stock or crypto asset can lead to large losses.",
        },
        {
          questionId: "diversification",
          blockingValues: ["no"],
          issue: "diversification is not understood",
          nextAction: "Read educational material on how spreading investments across assets and regions works.",
          warning: "Without diversification, your portfolio may be vulnerable to a single event.",
        },
        {
          questionId: "scamSigns",
          blockingValues: ["no"],
          issue: "investment scam warning signs are not recognised",
          nextAction: "Review the FCA's ScamSmart resources and common fraud patterns before investing.",
          warning: "Investment fraud costs UK savers millions each year. Scammers target beginners.",
        },
        {
          questionId: "fcaRegistration",
          blockingValues: ["no"],
          issue: "FCA register checks are not known",
          nextAction: "Bookmark register.fca.org.uk and verify any firm before transferring money.",
          warning: "Unregulated firms are not protected by the Financial Services Compensation Scheme.",
        },
        {
          questionId: "riskReturnTradeoff",
          blockingValues: ["no"],
          issue: "the risk-return trade-off is not accepted",
          nextAction: "Study how different asset types behave and why guaranteed high returns are unrealistic.",
          warning: "Expecting high returns with low risk makes you vulnerable to scams and unsuitable products.",
        },
      ],
      pause: {
        title: "Build risk awareness before investing",
        explanationPrefix: "Your answers show gaps in",
      },
      clarify: {
        title: "Clarify risk and scam awareness",
        explanationPrefix: 'You selected "Not sure" for',
        nextAction: "List the topics you are unsure about, then revisit FCA ScamSmart and diversification guides.",
        warning: "Do not send money to any firm you have not verified on the FCA register.",
      },
      ready: {
        title: "You have completed the Investing 101 learning path",
        explanation:
          "Your answers suggest you understand core risk, diversification, and scam-awareness concepts. This is not a licence to invest.",
        nextAction:
          "Keep learning from official sources. Consider professional advice before making investment decisions.",
        warning:
          "Scams evolve constantly. Stay sceptical of unsolicited offers, guaranteed returns, and pressure to act quickly.",
      },
    }),
};
