import type {Account, AccountInput} from "../account.types.ts";
import {getAccounts, saveAccounts} from "../account.repository.ts";
import {deletePassword, deleteSessionId, savePassword} from "./auth.service.ts";


export async function createAccount(input: AccountInput): Promise<Account> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (name.length === 0) {
        throw new Error("Name cannot be empty");
    }

    if (email.length === 0) {
        throw new Error("Email cannot be empty");
    }

    if (input.password.length === 0) {
        throw new Error("Password cannot be empty");
    }

    const accounts = await getAccounts();

    const accountAlreadyExists = accounts.some(
        account => account.email.toLowerCase() === email,
    );

    if (accountAlreadyExists) {
        throw new Error("Account already exists");
    }

    const now = new Date().toISOString();
    const account: Account = {
        id: crypto.randomUUID(),
        name,
        email,
        isActive: accounts.length === 0,
        createdAt: now,
        updatedAt: now,
    }

    await savePassword(account.id, input.password);

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


export async function deleteAccount(accountId: string): Promise<void> {
    const accounts = await getAccounts();

    const accountToDelete = accounts.find(account => account.id === accountId);

    if (!accountToDelete) {
        throw new Error("Account does not exist");
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

export async function switchAccount(accountId: string): Promise<void> {
    const accounts = await getAccounts();
    const accountExists = accounts.some(account => account.id === accountId);

    if (!accountExists) {
        throw new Error("Account does not exist");
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
