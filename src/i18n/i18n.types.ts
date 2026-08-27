import type {en} from "./locales/en/index.ts";

export const supportedLanguages = ["en"] as const;

export type Language = typeof supportedLanguages[number];

export type Messages = typeof en;

export type ErrorMessages = Messages["errors"];

export type I18nContextValue = {
    language: Language;
    messages: Messages;
    setLanguage: (language: Language) => void;
};
