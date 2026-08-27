import type {Account, AccountInput} from "../account.types.ts";
import {getStoredAccounts, saveAccounts} from "../account.repository.ts";
import {deletePassword, deleteSessionId, savePassword} from "./auth.service.ts";
import { createHash } from "crypto";
import type {ErrorMessages} from "../../../i18n/i18n.types.ts";

type AccountErrorMessages = ErrorMessages["accounts"];


export async function getAccounts(): Promise<Account[]> {
    return await getStoredAccounts();
}

function createAccountId(email: string): string {
    return createHash("sha256").update(email).digest("hex");
}

export async function createAccount(
    input: AccountInput,
    errors: AccountErrorMessages,
): Promise<Account> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (name.length === 0) {
        throw new Error(errors.nameRequired);
    }

    if (email.length === 0) {
        throw new Error(errors.emailRequired);
    }

    if (input.password.length === 0) {
        throw new Error(errors.passwordRequired);
    }

    const accounts = await getStoredAccounts();

    const accountAlreadyExists = accounts.some(
        account => account.email.toLowerCase() === email,
    );

    if (accountAlreadyExists) {
        throw new Error(errors.alreadyExists);
    }

    const now = new Date().toISOString();
    const account: Account = {
        id: createAccountId(email),
        name,
        email,
        isActive: accounts.length === 0,
        createdAt: now,
        updatedAt: now,
    }

    await savePassword(account.id, input.password, errors);

    try {
        await saveAccounts([...accounts, account]);
    }
    catch (error: unknown) {
        try {
            await deletePassword(account.id);
        }
        catch {
            // Preserve the original error. The credential cleanup can be retried later.
        }

        throw error;
    }

    return account;
}


export async function deleteAccount(
    accountId: string,
    errors: AccountErrorMessages,
): Promise<void> {
    const accounts = await getStoredAccounts();

    const accountToDelete = accounts.find(account => account.id === accountId);

    if (!accountToDelete) {
        throw new Error(errors.notFound);
    }

    const remainingAccounts = accounts.filter(account => account.id !== accountId);
    const nextActiveAccount = remainingAccounts.at(0);

    if (accountToDelete.isActive && nextActiveAccount) {
        nextActiveAccount.isActive = true;
        nextActiveAccount.updatedAt = new Date().toISOString();
    }

    await deletePassword(accountId);
    await deleteSessionId(accountId);
    await saveAccounts(remainingAccounts);
}

export async function switchAccount(
    accountId: string,
    errors: AccountErrorMessages,
): Promise<void> {
    const accounts = await getStoredAccounts();
    const accountExists = accounts.some(account => account.id === accountId);

    if (!accountExists) {
        throw new Error(errors.notFound);
    }

    const now = new Date().toISOString();
    const updatedAccounts = accounts.map(account => {
        const shouldBeActive = account.id === accountId;

        return {
            ...account,
            isActive: shouldBeActive,
            updatedAt: account.isActive === shouldBeActive ? account.updatedAt : now,
        };
    });

    await saveAccounts(updatedAccounts);
}
