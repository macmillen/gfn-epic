import type data from "./data/generated/final-data.json";

export type Card = (typeof data)[number] & {
  mysteryGame?: boolean;
};

export type FeedbackType =
  | { stage: "initial" }
  | { stage: "choose-option" }
  | { stage: "write-text"; option: "General" | "Idea" | "Issue" };
