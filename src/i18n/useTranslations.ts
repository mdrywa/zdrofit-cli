import {useContext} from "react";
import {I18nContext} from "./I18nProvider.tsx";
import type {I18nContextValue} from "./i18n.types.ts";
import {errorMessages} from "./locales/en/errors.ts";

export function useTranslations(): I18nContextValue {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error(
            errorMessages.general.translationsUnavailable,
        );
    }

    return context;
}
