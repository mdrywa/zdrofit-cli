import type {Account} from "../account.types.ts";
import {
    checkSessionInBrowser,
    loginInBrowser,
} from "../../../infrastructure/playwright/playwright.service.ts";
import {secretStore} from "../../../infrastructure/security/secret-store.ts";

const SERVICE_NAME = "com.zdrofit.cli";

function getPasswordSecretName(accountId: string): string {
    return `account:${accountId}:password`;
}

function getSessionSecretName(accountId: string): string {
    return `account:${accountId}:session`;
}

export async function login(account: Account): Promise<void> {
    const password = await getPassword(account.id);

    if (!password) {
        throw new Error(
            "Nie znaleziono hasła aktywnego konta w systemowym magazynie poświadczeń",
        );
    }

    try {
        const sessionId = await loginInBrowser(account.email, password);
        await saveSessionId(account.id, sessionId);
    }
    catch (error: unknown) {
        throw new Error(`Nie udało się zalogować: ${getErrorMessage(error)}`, {
            cause: error,
        });
    }
}

export async function checkSession(account: Account): Promise<boolean> {
    const sessionId = await getSessionId(account.id);

    if (!sessionId) {
        return false;
    }

    try {
        const isActive = await checkSessionInBrowser(sessionId);

        if (!isActive) {
            await deleteSessionId(account.id);
        }

        return isActive;
    }
    catch (error: unknown) {
        throw new Error(`Nie udało się sprawdzić sesji: ${getErrorMessage(error)}`, {
            cause: error,
        });
    }
}

export async function logout(accountId: string): Promise<void> {
    await deleteSessionId(accountId);
}

export async function getSessionId(accountId: string): Promise<string | null> {
    return await secretStore.get(SERVICE_NAME, getSessionSecretName(accountId));
}

export async function saveSessionId(accountId: string, sessionId: string): Promise<void> {
    const value = sessionId.trim();

    if (value.length === 0) {
        throw new Error("Session ID cannot be empty");
    }

    await secretStore.set(SERVICE_NAME, getSessionSecretName(accountId), value);
}

export async function deleteSessionId(accountId: string): Promise<void> {
    await secretStore.delete(SERVICE_NAME, getSessionSecretName(accountId));
}

export async function savePassword(accountId: string, password: string): Promise<void> {
    await secretStore.set(SERVICE_NAME, getPasswordSecretName(accountId), password);

    const savedPassword = await getPassword(accountId);

    if (savedPassword !== password) {
        throw new Error(
            "Nie udało się zweryfikować hasła w systemowym magazynie poświadczeń",
        );
    }
}

export async function getPassword(accountId: string): Promise<string | null> {
    return await secretStore.get(SERVICE_NAME, getPasswordSecretName(accountId));
}

export async function deletePassword(accountId: string): Promise<void> {
    await secretStore.delete(SERVICE_NAME, getPasswordSecretName(accountId));
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
