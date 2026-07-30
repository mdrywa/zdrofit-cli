import {startCli} from "./cli.tsx";

async function main(): Promise<void> {
    try {
        await startCli();
    }
    catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred.";

        console.error(`Failed to start Zdrofit CLI: ${message}`);
        process.exitCode = 1;
    }
}

void main();