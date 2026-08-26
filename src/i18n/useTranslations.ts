import {useContext} from "react";
import {I18nContext} from "./I18nProvider.tsx";
import type {I18nContextValue} from "./i18n.types.ts";

export function useTranslations(): I18nContextValue {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error(
            "useTranslations must be used within an I18nProvider",
        );
    }

    return context;
}
