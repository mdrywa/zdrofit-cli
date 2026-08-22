import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";

const WORKER_PATH = fileURLToPath(
    new URL("./playwright.worker.mjs", import.meta.url),
);
const WORKER_TIMEOUT_MS = 180_000;

type WorkerRequest =
    | {
        operation: "login";
        payload: {
            email: string;
            password: string;
        };
    }
    | {
        operation: "check-session";
        payload: {
            sessionId: string;
        };
    };

type WorkerResponse<T> =
    | {
        ok: true;
        data: T;
    }
    | {
        ok: false;
        error: {
            name: string;
            message: string;
        };
    };

export async function loginInBrowser(
    email: string,
    password: string,
): Promise<string> {
    const result = await runWorker<{sessionId: string}>({
        operation: "login",
        payload: {email, password},
    });

    return result.sessionId;
}

export async function checkSessionInBrowser(
    sessionId: string,
): Promise<boolean> {
    const result = await runWorker<{active: boolean}>({
        operation: "check-session",
        payload: {sessionId},
    });

    return result.active;
}

async function runWorker<T>(request: WorkerRequest): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
        const child = spawn("node", ["--experimental-strip-types", WORKER_PATH], {
            stdio: ["pipe", "pipe", "pipe"],
        });
        const stdoutChunks: Buffer[] = [];
        const stderrChunks: Buffer[] = [];
        let settled = false;

        const timeout = setTimeout(() => {
            child.kill();
            finish(() => reject(new Error(
                "Proces Playwright nie odpowiedział w wyznaczonym czasie",
            )));
        }, WORKER_TIMEOUT_MS);

        function finish(callback: () => void): void {
            if (settled) {
                return;
            }

            settled = true;
            clearTimeout(timeout);
            callback();
        }

        child.stdout.on("data", (chunk: Buffer) => {
            stdoutChunks.push(chunk);
        });
        child.stderr.on("data", (chunk: Buffer) => {
            stderrChunks.push(chunk);
        });
        child.on("error", error => {
            finish(() => reject(new Error(
                `Nie udało się uruchomić procesu Node dla Playwright: ${error.message}`,
                {cause: error},
            )));
        });
        child.on("close", () => {
            finish(() => {
                const stdout = Buffer.concat(stdoutChunks).toString("utf-8");
                const stderr = Buffer.concat(stderrChunks).toString("utf-8").trim();

                try {
                    const response = JSON.parse(stdout) as WorkerResponse<T>;

                    if (!response.ok) {
                        reject(new Error(response.error.message));
                        return;
                    }

                    resolve(response.data);
                }
                catch (error: unknown) {
                    const details = stderr || stdout || "brak odpowiedzi procesu";
                    reject(new Error(
                        `Nieprawidłowa odpowiedź procesu Playwright: ${details}`,
                        {cause: error},
                    ));
                }
            });
        });

        child.stdin.end(JSON.stringify(request));
    });
}
