#!/usr/bin/env node
import {startCli} from "./cli.tsx";
import {errorMessages} from "./i18n/locales/en/errors.ts";

async function main(): Promise<void> {
    try {
        await startCli();
    }
    catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : errorMessages.general.unexpected;

        console.error(errorMessages.general.startupFailed(message));
        process.exitCode = 1;
    }
}

void main();
