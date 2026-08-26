import React from "react"
import {render} from "ink";
import {App} from "./app/App.tsx";
import {I18nProvider} from "./i18n/I18nProvider.tsx";

export async function startCli(): Promise<void> {
    const instance = render(
            <I18nProvider>
                <App/>
            </I18nProvider>
        )

    await instance.waitUntilExit();
}
