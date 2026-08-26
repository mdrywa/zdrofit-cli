import {createContext, useMemo, useState, type ReactNode} from "react";
import {en} from "./locales/en/index.ts";
import type {I18nContextValue, Language, Messages} from "./i18n.types.ts";

const DEFAULT_LANGUAGE: Language = "en";

const translations: Record<Language, Messages> = {en};

export const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
    children: ReactNode;
    initialLanguage?: Language;
};

export function I18nProvider({
    children,
    initialLanguage = DEFAULT_LANGUAGE,
}: I18nProviderProps) {
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const messages = translations[language];

    const contextValue = useMemo<I18nContextValue>(() => ({
        language,
        messages,
        setLanguage,
    }), [language, messages]);

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
}
