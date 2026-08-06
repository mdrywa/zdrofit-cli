import {secrets} from "bun";
import {errors, type BrowserContext} from "playwright";
import type {Account} from "../account.types.ts";
import {
    closeBrowserSession,
    createBrowserSession,
} from "../../../infrastructure/playwright/browser.service.ts";

const SERVICE_NAME = "com.zdrofit.cli";
const LOGIN_URL = "https://zdrofit.pl/#logowanie";
const SESSION_CHECK_URL = "https://zdrofit.pl";
const SESSION_COOKIE_NAME = "SULUSESSID";
const SESSION_CHECK_TIMEOUT_MS = 15_000;

function getPasswordSecretName(accountId: string): string {
    return `account:${accountId}:password`;
}

function getSessionSecretName(accountId: string): string {
    return `account:${accountId}:session`;
}

export async function login(account: Account): Promise<void> {
    const password = await getPassword(account.id);

    if (!password) {
        throw new Error("Account password does not exist");
    }

    let sessionId: string | undefined;
    let context: BrowserContext | undefined;

    try {
        const browserSession = await createBrowserSession(false);
        context = browserSession.context;
        const {page} = browserSession;

        await page.goto(LOGIN_URL, {
            waitUntil: "domcontentloaded",
        });

        await page.waitForSelector("#member_login_form_email");
        await page.waitForSelector("#member_login_form_password");

        await page.locator("#member_login_form_email").fill(account.email);
        await page.locator("#member_login_form_password").fill(password);

        await page.waitForURL(
            url => !url.hash.includes("logowanie"),
            {
                timeout: 150_000,
                waitUntil: "networkidle",
            },
        );

        const sessionCookie = (await context.cookies()).find(
            cookie => cookie.name === SESSION_COOKIE_NAME,
        );

        sessionId = sessionCookie?.value;
    }
    catch (error: unknown) {
        if (error instanceof errors.TimeoutError) {
            throw new Error("Logowanie przekroczyło limit czasu", {
                cause: error,
            });
        }

        throw new Error("Failed to login account", {
            cause: error,
        });
    }
    finally {
        if (context) {
            await closeBrowserSession(context);
        }
    }

    if (!sessionId) {
        throw new Error(`Cookie ${SESSION_COOKIE_NAME} not found`);
    }

    await saveSessionId(account.id, sessionId);
}

export async function checkSession(account: Account): Promise<boolean> {
    const sessionId = await getSessionId(account.id);

    if (!sessionId) {
        return false;
    }

    let context: BrowserContext | undefined;

    try {
        const browserSession = await createBrowserSession(true);
        context = browserSession.context;
        const {page} = browserSession;

        await context.addCookies([
            {
                name: SESSION_COOKIE_NAME,
                value: sessionId,
                url: "https://zdrofit.pl",
            },
        ]);

        await page.goto(SESSION_CHECK_URL, {
            waitUntil: "networkidle",
            timeout: SESSION_CHECK_TIMEOUT_MS,
        });

        const loginText = page.getByText("Loguję się", {exact: true});
        const loginTextCount = await loginText.count();

        for (let index = 0; index < loginTextCount; index++) {
            if (await loginText.nth(index).isVisible()) {
                return false;
            }
        }

        return true;
    }
    catch (error: unknown) {
        if (error instanceof errors.TimeoutError) {
            return false;
        }

        throw new Error("Nie udało się sprawdzić sesji", {
            cause: error,
        });
    }
    finally {
        if (context) {
            await closeBrowserSession(context);
        }
    }
}

export async function logout(accountId: string): Promise<void> {
    await deleteSessionId(accountId);
}

export async function getSessionId(accountId: string): Promise<string | null> {
    return await secrets.get({
        service: SERVICE_NAME,
        name: getSessionSecretName(accountId),
    });
}

export async function saveSessionId(
    accountId: string,
    sessionId: string,
): Promise<void> {
    const value = sessionId.trim();

    if (value.length === 0) {
        throw new Error("Session ID cannot be empty");
    }

    await secrets.set({
        service: SERVICE_NAME,
        name: getSessionSecretName(accountId),
        value,
        allowUnrestrictedAccess: false,
    });
}

export async function deleteSessionId(accountId: string): Promise<void> {
    await secrets.delete({
        service: SERVICE_NAME,
        name: getSessionSecretName(accountId),
    });
}

export async function savePassword(
    accountId: string,
    password: string,
): Promise<void> {
    await secrets.set({
        service: SERVICE_NAME,
        name: getPasswordSecretName(accountId),
        value: password,
        allowUnrestrictedAccess: false,
    });
}

export async function getPassword(accountId: string): Promise<string | null> {
    return await secrets.get({
        service: SERVICE_NAME,
        name: getPasswordSecretName(accountId),
    });
}

export async function deletePassword(accountId: string): Promise<void> {
    await secrets.delete({
        service: SERVICE_NAME,
        name: getPasswordSecretName(accountId),
    });
}
