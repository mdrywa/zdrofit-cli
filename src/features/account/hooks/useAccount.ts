import {useEffect, useState} from "react";
import type {Account, CreateAccountInput} from "../account.types.ts";
import {getAccounts} from "../account.repository.ts";
import {
    createAccount,
    deleteAccount as deleteAccountService,
    switchAccount as switchAccountService,
} from "../services/account.service.ts";


export function useAccount() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const activeAccount = accounts.find(account => account.isActive);

    useEffect(() => {
        async function loadAccounts(): Promise<void> {
            try {
                const savedAccounts = await getAccounts();

                setAccounts(savedAccounts);
            }
            catch (error: unknown) {
                setError(getErrorMessage(error));
            }
            finally {
                setIsLoading(false);
            }
        }

        void loadAccounts();
    }, []);

    async function addAccount(input: CreateAccountInput): Promise<Account> {
        setError(null);

        try {
            const account = await createAccount(input);

            const savedAccounts = await getAccounts();

            setAccounts(savedAccounts);

            return account;
        }
        catch (error: unknown) {
            setError(getErrorMessage(error));
            throw error;
        }
    }

    async function deleteAccount(accountId: string): Promise<void> {
        setError(null);

        try {
            await deleteAccountService(accountId);

            const savedAccounts = await getAccounts();

            setAccounts(savedAccounts);
        }
        catch (error: unknown) {
            setError(getErrorMessage(error));
            throw error;
        }
    }

    async function switchAccount(accountId: string): Promise<void> {
        setError(null);

        try {
            await switchAccountService(accountId);

            const savedAccounts = await getAccounts();

            setAccounts(savedAccounts);
        }
        catch (error: unknown) {
            setError(getErrorMessage(error));
            throw error;
        }
    }

    return {
        accounts,
        activeAccount,
        isLoading,
        error,
        addAccount,
        deleteAccount,
        switchAccount,
    };
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unexpected account error";
}
