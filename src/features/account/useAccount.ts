import {useEffect, useState} from "react";
import type {Account, AccountInput} from "./account.types.ts";
import {
    createAccount,
    deleteAccount as deleteAccountService, getAccounts,
    switchAccount as switchAccountService,
} from "./services/account.service.ts";
import {checkSession, login} from "./services/auth.service.ts";
import {useTranslations} from "../../i18n/useTranslations.ts";


export function useAccount() {
    const {messages} = useTranslations();
    const errors = messages.errors.accounts;
    const browserErrors = messages.errors.browser;
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isRefreshingSession, setIsRefreshingSession] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const activeAccount = accounts.find(account => account.isActive);

    useEffect(() => {
        async function loadAccounts(): Promise<void> {
            try {
                const savedAccounts = await getAccounts();

                setAccounts(savedAccounts);

                const savedActiveAccount = savedAccounts.find(
                    account => account.isActive,
                );

                if (!savedActiveAccount) {
                    setIsSessionActive(false);
                    return;
                }

                setIsSessionActive(await checkSession(savedActiveAccount, errors));
            }
            catch (error) {
                setError(getErrorMessage(error, errors.unexpected));
                setIsSessionActive(false);
            }
            finally {
                setIsLoading(false);
                setIsCheckingSession(false);
            }
        }

        void loadAccounts();
    }, [errors]);

    async function addAccount(input: AccountInput): Promise<Account> {
        setError(null);

        try {
            const account = await createAccount(input, errors);

            const savedAccounts = await getAccounts();

            setAccounts(savedAccounts);

            return account;
        }
        catch (error: unknown) {
            setError(getErrorMessage(error, errors.unexpected));
            throw error;
        }
    }

    async function deleteAccount(accountId: string): Promise<void> {
        setError(null);

        try {
            await deleteAccountService(accountId, errors);

            const savedAccounts = await getAccounts();

            setAccounts(savedAccounts);
        }
        catch (error: unknown) {
            setError(getErrorMessage(error, errors.unexpected));
            throw error;
        }
    }

    async function switchAccount(accountId: string): Promise<void> {
        setError(null);
        setIsCheckingSession(true);
        setIsSessionActive(null);

        try {
            await switchAccountService(accountId, errors);

            const savedAccounts = await getAccounts();
            const switchedAccount = savedAccounts.find(
                account => account.id === accountId,
            );

            setAccounts(savedAccounts);

            if (!switchedAccount) {
                throw new Error(errors.notFound);
            }

            setIsSessionActive(await checkSession(switchedAccount, errors));
        }
        catch (error: unknown) {
            setError(getErrorMessage(error, errors.unexpected));
            setIsSessionActive(false);
            throw error;
        }
        finally {
            setIsCheckingSession(false);
        }
    }

    async function refreshSession(): Promise<boolean> {
        if (isRefreshingSession) {
            return false;
        }

        setError(null);
        setIsRefreshingSession(true);

        if (!activeAccount) {
            setError(errors.noActiveAccount);
            setIsRefreshingSession(false);
            return false;
        }

        try {
            await login(activeAccount, errors, browserErrors);
            setIsSessionActive(true);

            return true;
        }
        catch (error: unknown) {
            setError(getErrorMessage(error, errors.unexpected));
            setIsSessionActive(false);
            return false;
        }
        finally {
            setIsRefreshingSession(false);
        }
    }

    function deactivateSession(): void {
        setIsSessionActive(false);
    }

    return {
        accounts,
        activeAccount,
        isLoading,
        isCheckingSession,
        isRefreshingSession,
        isSessionActive,
        error,
        addAccount,
        deleteAccount,
        switchAccount,
        refreshSession,
        deactivateSession,
    };
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
}
