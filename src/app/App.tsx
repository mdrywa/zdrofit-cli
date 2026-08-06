import React, {useState} from "react";
import {Box, useApp} from "ink";
import {MainMenuScreen} from "./screens/MainMenuScreen.tsx";
import {AccountsScreen} from "../features/account/screens/AccountsScreen.tsx";
import {NewAccountScreen} from "../features/account/screens/NewAccountScreen.tsx";
import {useAccount} from "../features/account/hooks/useAccount.ts";
import {closeBrowser} from "../infrastructure/playwright/browser.service.ts";

type AppScreen =
    "main-menu" |
    "accounts" |
    "new-account"

export function App(){
    // Exit app function
    const {exit} = useApp();
    const {
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
    } = useAccount();
    // Current screen
    const [currentScreen, setCurrentScreen] = useState<AppScreen>("main-menu");

    function navigateTo(screen: AppScreen): void {
        setCurrentScreen(screen);
    }

    const activeAccountLabel = activeAccount
        ? `${activeAccount.name} - ${activeAccount.email}`
        : "Brak aktywnego konta";

    const sessionStatus = isCheckingSession
        ? "Sprawdzanie..."
        : isRefreshingSession
            ? "Odświeżanie..."
            : isSessionActive
                ? "Aktywna"
                : "Nieaktywna";

    async function handleAddAccount(input: Parameters<typeof addAccount>[0]): Promise<void> {
        navigateTo("accounts");
        await addAccount(input);
    }

    async function handleAccountChange(accountId: string): Promise<void> {
        navigateTo("main-menu");
        await switchAccount(accountId);
    }

    async function handleExit(): Promise<void> {
        await closeBrowser();
        exit()
    }


    function renderCurrentScreen(): React.ReactElement {
        switch (currentScreen) {
            case "main-menu":
            return (
                <MainMenuScreen
                    activeAccount={activeAccountLabel}
                    sessionActive={sessionStatus}
                    sessionError={error}
                    onAccountClick={() => navigateTo("accounts")}
                    onSessionRefresh={refreshSession}
                    onExit={handleExit}
                />
            )
            case "accounts":
            return (
                <AccountsScreen
                    accounts={accounts}
                    isLoading={isLoading}
                    error={error}
                    activeAccount={activeAccountLabel}
                    sessionActive={sessionStatus}
                    returnClick={() => navigateTo("main-menu")}
                    newAccountClick={() => navigateTo("new-account")}
                    accountChangeClick={handleAccountChange}
                    deleteAccountClick={deleteAccount}
                />
            )
            case "new-account":
                return (
                    <NewAccountScreen
                        activeAccount={activeAccountLabel}
                        sessionActive={sessionStatus}
                        error={error}
                        returnClick={() => navigateTo("accounts")}
                        onSubmit={handleAddAccount}
                    />
                )
        }
    }

    return (
        <Box>
            {renderCurrentScreen()}
        </Box>
    )
}
